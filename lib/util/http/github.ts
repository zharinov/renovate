import is from '@sindresorhus/is';
import { DateTime } from 'luxon';
import pAll from 'p-all';
import parseLinkHeader from 'parse-link-header';
import { PlatformId } from '../../constants';
import {
  PLATFORM_BAD_CREDENTIALS,
  PLATFORM_INTEGRATION_UNAUTHORIZED,
  PLATFORM_RATE_LIMIT_EXCEEDED,
  REPOSITORY_CHANGED,
} from '../../constants/error-messages';
import { logger } from '../../logger';
import { ExternalHostError } from '../../types/errors/external-host-error';
import { getCache } from '../../util/cache/repository';
import { maskToken } from '../mask';
import { regEx } from '../regex';
import { ensureTrailingSlash } from '../url';
import { GotLegacyError } from './legacy';
import { Http, HttpPostOptions, HttpResponse, InternalHttpOptions } from '.';

const githubBaseUrl = 'https://api.github.com/';
let baseUrl = githubBaseUrl;
export const setBaseUrl = (url: string): void => {
  baseUrl = url;
};

interface GithubInternalOptions extends InternalHttpOptions {
  body?: string;
}

export interface GithubHttpOptions extends InternalHttpOptions {
  paginate?: boolean | string;
  paginationField?: string;
  pageLimit?: number;
  token?: string;
}

interface GithubGraphqlRepoData<T = unknown> {
  repository?: T;
}

interface GithubGraphqlResponse<T = unknown> {
  data?: T;
  errors?: {
    type?: string;
    message: string;
    locations: unknown;
  }[];
}

function handleGotError(
  err: GotLegacyError,
  url: string | URL,
  opts: GithubHttpOptions
): never {
  const path = url.toString();
  let message = err.message || '';
  if (is.plainObject(err.response?.body) && 'message' in err.response.body) {
    message = String(err.response.body.message);
  }
  if (
    err.code === 'ENOTFOUND' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'EAI_AGAIN' ||
    err.code === 'ECONNRESET'
  ) {
    logger.debug({ err }, 'GitHub failure: RequestError');
    throw new ExternalHostError(err, PlatformId.Github);
  }
  if (err.name === 'ParseError') {
    logger.debug({ err }, '');
    throw new ExternalHostError(err, PlatformId.Github);
  }
  if (err.statusCode >= 500 && err.statusCode < 600) {
    logger.debug({ err }, 'GitHub failure: 5xx');
    throw new ExternalHostError(err, PlatformId.Github);
  }
  if (
    err.statusCode === 403 &&
    message.startsWith('You have triggered an abuse detection mechanism')
  ) {
    logger.debug({ err }, 'GitHub failure: abuse detection');
    throw new Error(PLATFORM_RATE_LIMIT_EXCEEDED);
  }
  if (
    err.statusCode === 403 &&
    message.startsWith('You have exceeded a secondary rate limit')
  ) {
    logger.debug({ err }, 'GitHub failure: secondary rate limit');
    throw new Error(PLATFORM_RATE_LIMIT_EXCEEDED);
  }
  if (err.statusCode === 403 && message.includes('Upgrade to GitHub Pro')) {
    logger.debug({ path }, 'Endpoint needs paid GitHub plan');
    throw err;
  }
  if (err.statusCode === 403 && message.includes('rate limit exceeded')) {
    logger.debug({ err }, 'GitHub failure: rate limit');
    throw new Error(PLATFORM_RATE_LIMIT_EXCEEDED);
  }
  if (
    err.statusCode === 403 &&
    message.startsWith('Resource not accessible by integration')
  ) {
    logger.debug(
      { err },
      'GitHub failure: Resource not accessible by integration'
    );
    throw new Error(PLATFORM_INTEGRATION_UNAUTHORIZED);
  }
  if (err.statusCode === 401 && message.includes('Bad credentials')) {
    const rateLimit = err.headers?.['x-ratelimit-limit'] ?? -1;
    logger.debug(
      {
        token: maskToken(opts.token),
        err,
      },
      'GitHub failure: Bad credentials'
    );
    if (rateLimit === '60') {
      throw new ExternalHostError(err, PlatformId.Github);
    }
    throw new Error(PLATFORM_BAD_CREDENTIALS);
  }
  if (err.statusCode === 422) {
    if (
      message.includes('Review cannot be requested from pull request author')
    ) {
      throw err;
    } else if (err.body?.errors?.find((e: any) => e.code === 'invalid')) {
      logger.debug({ err }, 'Received invalid response - aborting');
      throw new Error(REPOSITORY_CHANGED);
    } else if (
      err.body?.errors?.find((e: any) =>
        e.message?.startsWith('A pull request already exists')
      )
    ) {
      throw err;
    }
    logger.debug({ err }, '422 Error thrown from GitHub');
    throw new ExternalHostError(err, PlatformId.Github);
  }
  if (
    err.statusCode === 410 &&
    err.body?.message === 'Issues are disabled for this repo'
  ) {
    throw err;
  }
  if (err.statusCode === 404) {
    logger.debug({ url: path }, 'GitHub 404');
  } else {
    logger.debug({ err }, 'Unknown GitHub error');
  }
  throw err;
}

interface GraphqlOptions {
  variables?: Record<string, string | number | null>;
  paginate?: boolean;
  count?: number;
  limit?: number;
  cursor?: string;
  acceptHeader?: string;
}

function constructAcceptString(input?: any): string {
  const defaultAccept = 'application/vnd.github.v3+json';
  const acceptStrings =
    typeof input === 'string' ? input.split(regEx(/\s*,\s*/)) : [];
  if (
    !acceptStrings.some((x) => x.startsWith('application/vnd.github.')) ||
    acceptStrings.length < 2
  ) {
    acceptStrings.push(defaultAccept);
  }
  return acceptStrings.join(', ');
}

const MAX_GRAPHQL_PAGE_SIZE = 100;

function getGraphqlPageSize(
  baseUrl: string,
  fieldName: string,
  initialCount = MAX_GRAPHQL_PAGE_SIZE
): number {
  // istanbul ignore if
  if (ensureTrailingSlash(baseUrl) !== ensureTrailingSlash(githubBaseUrl)) {
    return initialCount;
  }

  let count = initialCount;

  const cache = getCache();
  cache.platform ??= {};
  cache.platform.github ??= {};
  cache.platform.github.graphqlPageCache ??= {};
  const cachedRecord = cache.platform.github.graphqlPageCache[fieldName];
  delete cache.platform.github.graphqlPageCache[fieldName];

  const now = DateTime.local();
  let timestamp = now.toISO();

  if (cachedRecord) {
    logger.debug(
      { fieldName, ...cachedRecord },
      'Found cached GraphQL page size'
    );
    const then = DateTime.fromISO(cachedRecord.pageLastResizedAt);
    const expiry = then.plus({ hours: 24 });
    const isExpired = now > expiry;
    timestamp = isExpired ? now.toISO() : then.toISO();
    count = isExpired
      ? Math.min(count * 2, MAX_GRAPHQL_PAGE_SIZE)
      : cachedRecord.pageSize;
  }

  if (count < MAX_GRAPHQL_PAGE_SIZE) {
    cache.platform.github.graphqlPageCache[fieldName] = {
      pageLastResizedAt: timestamp,
      pageSize: count,
    };
  }

  return count;
}

function setGraphqlPageSize(
  baseUrl: string,
  fieldName: string,
  count: number
): void {
  if (
    ensureTrailingSlash(baseUrl) === ensureTrailingSlash(githubBaseUrl) &&
    count !== getGraphqlPageSize(baseUrl, fieldName)
  ) {
    const now = DateTime.local();
    const timestamp = now.toISO();
    logger.debug(
      { fieldName, count, timestamp },
      'Saving new GraphQL page size'
    );
    const cache = getCache();
    cache.platform ??= {};
    cache.platform.github ??= {};
    cache.platform.github.graphqlPageCache ??= {};
    cache.platform.github.graphqlPageCache[fieldName] = {
      pageLastResizedAt: timestamp,
      pageSize: count,
    };
  }
}

export class GithubHttp extends Http<GithubHttpOptions, GithubHttpOptions> {
  constructor(
    hostType: string = PlatformId.Github,
    options?: GithubHttpOptions
  ) {
    super(hostType, options);
  }

  protected override async request<T>(
    url: string | URL,
    options?: GithubInternalOptions & GithubHttpOptions,
    okToRetry = true
  ): Promise<HttpResponse<T> | null> {
    let result = null;

    const opts = {
      baseUrl,
      ...options,
      throwHttpErrors: true,
    };

    const accept = constructAcceptString(opts.headers?.accept);

    opts.headers = {
      ...opts.headers,
      accept,
    };

    try {
      result = await super.request<T>(url, opts);

      // istanbul ignore else: Can result be null ???
      if (result !== null) {
        if (opts.paginate) {
          // Check if result is paginated
          const pageLimit = opts.pageLimit || 10;
          const linkHeader =
            result?.headers?.link &&
            parseLinkHeader(result.headers.link as string);
          if (linkHeader?.next && linkHeader?.last) {
            let lastPage = +linkHeader.last.page;
            // istanbul ignore else: needs a test
            if (!process.env.RENOVATE_PAGINATE_ALL && opts.paginate !== 'all') {
              lastPage = Math.min(pageLimit, lastPage);
            }
            const pageNumbers = Array.from(
              new Array(lastPage),
              (x, i) => i + 1
            ).slice(1);
            const queue = pageNumbers.map(
              (page) => (): Promise<HttpResponse> => {
                const nextUrl = new URL(linkHeader.next.url, baseUrl);
                delete nextUrl.search;
                nextUrl.searchParams.set('page', page.toString());
                return this.request(
                  nextUrl,
                  { ...opts, paginate: false },
                  okToRetry
                );
              }
            );
            const pages = await pAll(queue, { concurrency: 5 });
            if (opts.paginationField) {
              result.body[opts.paginationField] = result.body[
                opts.paginationField
              ].concat(
                ...pages
                  .filter(Boolean)
                  .map((page) => page.body[opts.paginationField])
              );
            } else {
              result.body = result.body.concat(
                ...pages.filter(Boolean).map((page) => page.body)
              );
            }
          }
        }
      }
    } catch (err) {
      handleGotError(err, url, opts);
    }

    return result;
  }

  public async requestGraphql<T = unknown>(
    query: string,
    options: GraphqlOptions = {}
  ): Promise<GithubGraphqlResponse<T>> {
    let result = null;

    const path = 'graphql';

    const { paginate, count = MAX_GRAPHQL_PAGE_SIZE, cursor = null } = options;
    let { variables } = options;
    if (paginate) {
      variables = {
        ...variables,
        count,
        cursor,
      };
    }
    const body = variables ? { query, variables } : { query };

    const opts: HttpPostOptions = {
      baseUrl: baseUrl.replace('/v3/', '/'), // GHE uses unversioned graphql path
      body,
      headers: { accept: options?.acceptHeader },
    };

    logger.trace(`Performing Github GraphQL request`);

    try {
      const res = await this.postJson<GithubGraphqlResponse<T>>(
        'graphql',
        opts
      );
      result = res?.body;
    } catch (err) {
      logger.debug({ err, query, options }, 'Unexpected GraphQL Error');
      if (err instanceof ExternalHostError && count && count > 10) {
        logger.info('Reducing pagination count to workaround graphql errors');
        return null;
      }
      handleGotError(err, path, opts);
    }
    return result;
  }

  async queryRepoField<T = Record<string, unknown>>(
    query: string,
    fieldName: string,
    options: GraphqlOptions = {}
  ): Promise<T[]> {
    const result: T[] = [];

    const { paginate = true } = options;

    let optimalCount: null | number = null;
    let count = getGraphqlPageSize(
      baseUrl,
      fieldName,
      options.count ?? MAX_GRAPHQL_PAGE_SIZE
    );
    let limit = options.limit || 1000;
    let cursor: string = null;

    let isIterating = true;
    while (isIterating) {
      const res = await this.requestGraphql<GithubGraphqlRepoData<T>>(query, {
        ...options,
        count: Math.min(count, limit),
        cursor,
        paginate,
      });
      const fieldData = res?.data?.repository?.[fieldName];
      if (fieldData) {
        optimalCount = count;

        const { nodes = [], edges = [], pageInfo } = fieldData;
        result.push(...nodes);
        result.push(...edges);

        limit = Math.max(0, limit - nodes.length - edges.length);

        if (limit === 0) {
          isIterating = false;
        } else if (paginate && pageInfo) {
          const { hasNextPage, endCursor } = pageInfo;
          if (hasNextPage && endCursor) {
            cursor = endCursor;
          } else {
            isIterating = false;
          }
        }
      } else {
        count = Math.floor(count / 2);
        if (count === 0) {
          logger.warn({ query, options, res }, 'Error fetching GraphQL nodes');
          isIterating = false;
        }
      }

      if (!paginate) {
        isIterating = false;
      }
    }

    setGraphqlPageSize(baseUrl, fieldName, optimalCount);

    return result;
  }
}

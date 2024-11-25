import { Readable } from 'node:stream';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { XmlDocument } from 'xmldoc';
import { HOST_DISABLED } from '../../../constants/error-messages';
import { logger } from '../../../logger';
import { ExternalHostError } from '../../../types/errors/external-host-error';
import { type Http, HttpError } from '../../../util/http';
import type { HttpOptions, HttpResponse } from '../../../util/http/types';
import { regEx } from '../../../util/regex';
import { Result } from '../../../util/result';
import { getS3Client, parseS3Url } from '../../../util/s3';
import { streamToString } from '../../../util/streams';
import { ensureTrailingSlash, parseUrl } from '../../../util/url';
import { normalizeDate } from '../metadata';
import { getGoogleAuthToken } from '../util';
import { MAVEN_REPO } from './common';
import {
  type DependencyInfo,
  type MavenDependency,
  type MavenFetchResult,
  type MavenFetchSuccess,
} from './types';

function getHost(url: string): string | null {
  return parseUrl(url)?.host ?? /* istanbul ignore next: not possible */ null;
}

function isTemporaryError(err: HttpError): boolean {
  if (err.code === 'ECONNRESET') {
    return true;
  }

  if (err.response) {
    const status = err.response.statusCode;
    return status === 429 || (status >= 500 && status < 600);
  }

  return false;
}

function isHostError(err: HttpError): boolean {
  return err.code === 'ETIMEDOUT';
}

function isNotFoundError(err: HttpError): boolean {
  return err.code === 'ENOTFOUND' || err.response?.statusCode === 404;
}

function isPermissionsIssue(err: HttpError): boolean {
  const status = err.response?.statusCode;
  return status === 401 || status === 403;
}

function isConnectionError(err: HttpError): boolean {
  return (
    err.code === 'EAI_AGAIN' ||
    err.code === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
    err.code === 'ECONNREFUSED'
  );
}

function isUnsupportedHostError(err: HttpError): boolean {
  return err.name === 'UnsupportedProtocolError';
}

export async function downloadHttpProtocol(
  http: Http,
  pkgUrl: URL | string,
  opts: HttpOptions = {},
): Promise<MavenFetchResult> {
  const url = pkgUrl.toString();
  const fetchResult = await Result.wrap<HttpResponse, Error>(
    http.get(url, opts),
  )
    .transform((res): MavenFetchSuccess<string> => {
      const result: MavenFetchSuccess<string> = { data: res.body };

      if (!res.authorization) {
        result.isCacheable = true;
      }

      const lastModified = normalizeDate(res?.headers?.['last-modified']);
      if (lastModified) {
        result.lastModified = lastModified;
      }

      return result;
    })
    .catch((err): MavenFetchResult => {
      // istanbul ignore next: never happens, needs for type narrowing
      if (!(err instanceof HttpError)) {
        return Result.err({ type: 'unknown', err });
      }

      const failedUrl = url;
      if (err.message === HOST_DISABLED) {
        logger.trace({ failedUrl }, 'Host disabled');
        return Result.err({ type: 'host-disabled' });
      }

      if (isNotFoundError(err)) {
        logger.trace({ failedUrl }, `Url not found`);
        return Result.err({ type: 'not-found' });
      }

      if (isHostError(err)) {
        logger.debug(`Cannot connect to host ${failedUrl}`);
        return Result.err({ type: 'host-error' });
      }

      if (isPermissionsIssue(err)) {
        logger.debug(
          `Dependency lookup unauthorized. Please add authentication with a hostRule for ${failedUrl}`,
        );
        return Result.err({ type: 'permission-issue' });
      }

      if (isTemporaryError(err)) {
        logger.debug({ failedUrl, err }, 'Temporary error');
        if (getHost(url) === getHost(MAVEN_REPO)) {
          return Result.err({ type: 'maven-central-temporary-error', err });
        } else {
          return Result.err({ type: 'temporary-error' });
        }
      }

      if (isConnectionError(err)) {
        logger.debug(`Connection refused to maven registry ${failedUrl}`);
        return Result.err({ type: 'connection-error' });
      }

      if (isUnsupportedHostError(err)) {
        logger.debug(`Unsupported host ${failedUrl}`);
        return Result.err({ type: 'unsupported-host' });
      }

      logger.info({ failedUrl, err }, 'Unknown HTTP download error');
      return Result.err({ type: 'unknown', err });
    });

  const { err } = fetchResult.unwrap();
  if (err?.type === 'maven-central-temporary-error') {
    throw new ExternalHostError(err.err);
  }

  return fetchResult;
}

export async function downloadHttpContent(
  http: Http,
  pkgUrl: URL | string,
  opts: HttpOptions = {},
): Promise<string | null> {
  const fetchResult = await downloadHttpProtocol(http, pkgUrl, opts);
  return fetchResult.transform(({ data }) => data).unwrapOrNull();
}

function isS3NotFound(err: Error): boolean {
  return err.message === 'NotFound' || err.message === 'NoSuchKey';
}

export async function downloadS3Protocol(
  pkgUrl: URL,
): Promise<MavenFetchResult> {
  logger.trace({ url: pkgUrl.toString() }, `Attempting to load S3 dependency`);

  const s3Url = parseS3Url(pkgUrl);
  if (!s3Url) {
    return Result.err({ type: 'invalid-url' });
  }

  return await Result.wrap(() => {
    const command = new GetObjectCommand(s3Url);
    const client = getS3Client();
    return client.send(command);
  })
    .transform(
      async ({
        Body,
        LastModified,
        DeleteMarker,
      }): Promise<MavenFetchResult> => {
        if (DeleteMarker) {
          return Result.err({ type: 'not-found' });
        }

        if (!(Body instanceof Readable)) {
          return Result.err({ type: 'unsupported-format' });
        }

        const data = await streamToString(Body);
        const result: MavenFetchSuccess = { data };

        const lastModified = normalizeDate(LastModified);
        if (lastModified) {
          result.lastModified = lastModified;
        }

        return Result.ok(result);
      },
    )
    .catch((err): MavenFetchResult => {
      if (!(err instanceof Error)) {
        return Result.err(err);
      }

      if (err.name === 'CredentialsProviderError') {
        return Result.err({ type: 'credentials-error' });
      }

      if (err.message === 'Region is missing') {
        return Result.err({ type: 'missing-aws-region' });
      }

      if (isS3NotFound(err)) {
        return Result.err({ type: 'not-found' });
      }

      return Result.err({ type: 'unknown', err });
    })
    .onError((err) => {
      const failedUrl = pkgUrl.toString();

      if (err.type === 'credentials-error') {
        logger.debug(
          { failedUrl },
          'Maven S3 lookup error: credentials provider error, check "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" variables',
        );
        return;
      }

      if (err.type === 'missing-aws-region') {
        logger.debug(
          { failedUrl },
          'Maven S3 lookup error: missing region, check "AWS_REGION" variable',
        );
        return;
      }

      if (err.type === 'not-found') {
        logger.trace({ failedUrl }, 'Maven S3 lookup error: object not found');
        return;
      }

      if (err.type === 'unknown') {
        logger.debug(
          { failedUrl, err: err.err },
          'Maven S3 lookup error: unknown error',
        );
        return;
      }
    });
}

export async function downloadArtifactRegistryProtocol(
  http: Http,
  pkgUrl: URL,
): Promise<MavenFetchResult> {
  const opts: HttpOptions = {};
  const host = pkgUrl.host;
  const path = pkgUrl.pathname;

  logger.trace({ host, path }, `Using google auth for Maven repository`);
  const auth = await getGoogleAuthToken();
  if (auth) {
    opts.headers = { authorization: `Basic ${auth}` };
  } else {
    logger.once.debug(
      { host, path },
      'Could not get Google access token, using no auth',
    );
  }

  const url = pkgUrl.toString().replace('artifactregistry:', 'https:');

  return await downloadHttpProtocol(http, url, opts);
}

function containsPlaceholder(str: string): boolean {
  return regEx(/\${.*?}/g).test(str);
}

export function getMavenUrl(
  dependency: MavenDependency,
  repoUrl: string,
  path: string,
): URL {
  return new URL(
    `${dependency.dependencyUrl}/${path}`,
    ensureTrailingSlash(repoUrl),
  );
}

export async function downloadMaven(
  http: Http,
  url: URL | string,
): Promise<MavenFetchResult> {
  const pkgUrl = url instanceof URL ? url : parseUrl(url);
  // istanbul ignore if
  if (!pkgUrl) {
    return Result.err({ type: 'invalid-url' });
  }

  const protocol = pkgUrl.protocol.slice(0, -1);

  let result: MavenFetchResult = Result.err({ type: 'unsupported-protocol' });

  if (protocol === 'http' || protocol === 'https') {
    result = await downloadHttpProtocol(http, pkgUrl);
  }

  if (protocol === 'artifactregistry') {
    result = await downloadArtifactRegistryProtocol(http, pkgUrl);
  }

  if (protocol === 's3') {
    result = await downloadS3Protocol(pkgUrl);
  }

  return result.onError((err) => {
    if (err.type === 'unsupported-protocol') {
      logger.debug(
        { url: pkgUrl.toString() },
        `Maven lookup error: unsupported protocol (${protocol})`,
      );
    }
  });
}

export async function downloadMavenXml(
  http: Http,
  url: URL | string,
): Promise<MavenFetchResult<XmlDocument>> {
  const rawResult = await downloadMaven(http, url);
  const xmlResult = rawResult.transform((result) => ({
    ...result,
    data: new XmlDocument(result.data),
  }));
  return xmlResult;
}

export function getDependencyParts(packageName: string): MavenDependency {
  const [group, name] = packageName.split(':');
  const dependencyUrl = `${group.replace(regEx(/\./g), '/')}/${name}`;
  return {
    display: packageName,
    group,
    name,
    dependencyUrl,
  };
}

function extractSnapshotVersion(metadata: XmlDocument): string | null {
  // Parse the maven-metadata.xml for the snapshot version and determine
  // the fixed version of the latest deployed snapshot.
  // The metadata descriptor can be found at
  // https://maven.apache.org/ref/3.3.3/maven-repository-metadata/repository-metadata.html
  //
  // Basically, we need to replace -SNAPSHOT with the artifact timestanp & build number,
  // so for example 1.0.0-SNAPSHOT will become 1.0.0-<timestamp>-<buildNumber>
  const version = metadata
    .descendantWithPath('version')
    ?.val?.replace('-SNAPSHOT', '');

  const snapshot = metadata.descendantWithPath('versioning.snapshot');
  const timestamp = snapshot?.childNamed('timestamp')?.val;
  const build = snapshot?.childNamed('buildNumber')?.val;

  // If we weren't able to parse out the required 3 version elements,
  // return null because we can't determine the fixed version of the latest snapshot.
  if (!version || !timestamp || !build) {
    return null;
  }
  return `${version}-${timestamp}-${build}`;
}

async function getSnapshotFullVersion(
  http: Http,
  version: string,
  dependency: MavenDependency,
  repoUrl: string,
): Promise<string | null> {
  // To determine what actual files are available for the snapshot, first we have to fetch and parse
  // the metadata located at http://<repo>/<group>/<artifact>/<version-SNAPSHOT>/maven-metadata.xml
  const metadataUrl = getMavenUrl(
    dependency,
    repoUrl,
    `${version}/maven-metadata.xml`,
  );

  const metadataXmlResult = await downloadMavenXml(http, metadataUrl);

  return metadataXmlResult
    .transform(({ data }) => {
      const nullErr = { type: 'snapshot-extract-error' };
      return Result.wrapNullable(extractSnapshotVersion(data), nullErr);
    })
    .unwrapOrNull();
}

function isSnapshotVersion(version: string): boolean {
  if (version.endsWith('-SNAPSHOT')) {
    return true;
  }
  return false;
}

export async function createUrlForDependencyPom(
  http: Http,
  version: string,
  dependency: MavenDependency,
  repoUrl: string,
): Promise<string> {
  if (isSnapshotVersion(version)) {
    // By default, Maven snapshots are deployed to the repository with fixed file names.
    // Resolve the full, actual pom file name for the version.
    const fullVersion = await getSnapshotFullVersion(
      http,
      version,
      dependency,
      repoUrl,
    );

    // If we were able to resolve the version, use that, otherwise fall back to using -SNAPSHOT
    if (fullVersion !== null) {
      // TODO: types (#22198)
      return `${version}/${dependency.name}-${fullVersion}.pom`;
    }
  }

  // TODO: types (#22198)
  return `${version}/${dependency.name}-${version}.pom`;
}

export async function getDependencyInfo(
  http: Http,
  dependency: MavenDependency,
  repoUrl: string,
  version: string,
  recursionLimit = 5,
): Promise<DependencyInfo> {
  const path = await createUrlForDependencyPom(
    http,
    version,
    dependency,
    repoUrl,
  );

  const pomUrl = getMavenUrl(dependency, repoUrl, path);
  const pomXmlResult = await downloadMavenXml(http, pomUrl);
  const dependencyInfoResult = await pomXmlResult.transform(
    async ({ data: pomContent }) => {
      const result: DependencyInfo = {};

      const homepage = pomContent.valueWithPath('url');
      if (homepage && !containsPlaceholder(homepage)) {
        result.homepage = homepage;
      }

      const sourceUrl = pomContent.valueWithPath('scm.url');
      if (sourceUrl && !containsPlaceholder(sourceUrl)) {
        result.sourceUrl = sourceUrl
          .replace(regEx(/^scm:/), '')
          .replace(regEx(/^git:/), '')
          .replace(regEx(/^git@github.com:/), 'https://github.com/')
          .replace(regEx(/^git@github.com\//), 'https://github.com/');

        if (result.sourceUrl.startsWith('//')) {
          // most likely the result of us stripping scm:, git: etc
          // going with prepending https: here which should result in potential information retrival
          result.sourceUrl = `https:${result.sourceUrl}`;
        }
      }

      const groupId = pomContent.valueWithPath('groupId');
      if (groupId) {
        result.packageScope = groupId;
      }

      const parent = pomContent.childNamed('parent');
      if (
        recursionLimit > 0 &&
        parent &&
        (!result.sourceUrl || !result.homepage)
      ) {
        // if we found a parent and are missing some information
        // trying to get the scm/homepage information from it
        const [parentGroupId, parentArtifactId, parentVersion] = [
          'groupId',
          'artifactId',
          'version',
        ].map((k) => parent.valueWithPath(k)?.replace(/\s+/g, ''));
        if (parentGroupId && parentArtifactId && parentVersion) {
          const parentDisplayId = `${parentGroupId}:${parentArtifactId}`;
          const parentDependency = getDependencyParts(parentDisplayId);
          const parentInformation = await getDependencyInfo(
            http,
            parentDependency,
            repoUrl,
            parentVersion,
            recursionLimit - 1,
          );
          if (!result.sourceUrl && parentInformation.sourceUrl) {
            result.sourceUrl = parentInformation.sourceUrl;
          }
          if (!result.homepage && parentInformation.homepage) {
            result.homepage = parentInformation.homepage;
          }
        }
      }

      return result;
    },
  );

  return dependencyInfoResult.unwrapOrElse({});
}

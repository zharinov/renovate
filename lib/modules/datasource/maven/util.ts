import type { Readable } from 'stream';
import url from 'url';
import { DateTime } from 'luxon';
import { XmlDocument } from 'xmldoc';
import { HOST_DISABLED } from '../../../constants/error-messages';
import { logger } from '../../../logger';
import { ExternalHostError } from '../../../types/errors/external-host-error';
import type { Http } from '../../../util/http';
import type { HttpResponse } from '../../../util/http/types';
import { regEx } from '../../../util/regex';
import { parseUrl } from '../../../util/url';
import { normalizeDate } from '../metadata';
import type { ReleaseResult } from '../types';
import { MAVEN_REPO } from './common';
import { getS3Client, parseS3Url } from './s3';
import type {
  HttpResourceCheckResult,
  MavenDependency,
  MavenXml,
} from './types';

const getHost = (x: string): string => new url.URL(x).host;

function isMavenCentral(pkgUrl: url.URL | string): boolean {
  const host = typeof pkgUrl === 'string' ? pkgUrl : pkgUrl.host;
  return getHost(MAVEN_REPO) === host;
}

function isTemporalError(err: { code: string; statusCode: number }): boolean {
  return (
    err.code === 'ECONNRESET' ||
    err.statusCode === 429 ||
    (err.statusCode >= 500 && err.statusCode < 600)
  );
}

function isHostError(err: { code: string }): boolean {
  return err.code === 'ETIMEDOUT';
}

function isNotFoundError(err: { code: string; statusCode: number }): boolean {
  return err.code === 'ENOTFOUND' || err.statusCode === 404;
}

function isPermissionsIssue(err: { statusCode: number }): boolean {
  return err.statusCode === 401 || err.statusCode === 403;
}

function isConnectionError(err: { code: string }): boolean {
  return (
    err.code === 'EAI_AGAIN' ||
    err.code === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
    err.code === 'ECONNREFUSED'
  );
}

function isUnsupportedHostError(err: { name: string }): boolean {
  return err.name === 'UnsupportedProtocolError';
}

export async function downloadHttpProtocol(
  http: Http,
  pkgUrl: url.URL | string
): Promise<Partial<HttpResponse>> {
  let raw: HttpResponse;
  try {
    raw = await http.get(pkgUrl.toString());
    return raw;
  } catch (err) {
    const failedUrl = pkgUrl.toString();
    if (err.message === HOST_DISABLED) {
      // istanbul ignore next
      logger.trace({ failedUrl }, 'Host disabled');
    } else if (isNotFoundError(err)) {
      logger.trace({ failedUrl }, `Url not found`);
    } else if (isHostError(err)) {
      // istanbul ignore next
      logger.debug({ failedUrl }, `Cannot connect to host`);
    } else if (isPermissionsIssue(err)) {
      logger.debug(
        { failedUrl },
        'Dependency lookup unauthorized. Please add authentication with a hostRule'
      );
    } else if (isTemporalError(err)) {
      logger.debug({ failedUrl, err }, 'Temporary error');
      if (isMavenCentral(pkgUrl)) {
        throw new ExternalHostError(err);
      }
    } else if (isConnectionError(err)) {
      // istanbul ignore next
      logger.debug({ failedUrl }, 'Connection refused to maven registry');
    } else if (isUnsupportedHostError(err)) {
      // istanbul ignore next
      logger.debug({ failedUrl }, 'Unsupported host');
    } else {
      logger.info({ failedUrl, err }, 'Unknown HTTP download error');
    }
    return {};
  }
}

function isS3NotFound(err: { name: string; message: string }): boolean {
  return err.message === 'NotFound' || err.message === 'NoSuchKey';
}

export async function downloadS3Protocol(
  pkgUrl: URL | string
): Promise<string> {
  logger.trace({ url: pkgUrl.toString() }, `Attempting to load S3 dependency`);
  let body: string;
  try {
    const s3Url = parseS3Url(pkgUrl.toString());
    if (s3Url === null) {
      // istanbul ignore next
      return '';
    }
    const response = await getS3Client().getObject(s3Url);
    const stream = response.Body as Readable;
    const buffers = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => resolve(Buffer.concat(chunks)));
      stream.once('error', reject);
    });
    body = buffers.toString();
    return body;
  } catch (err) {
    const failedUrl = pkgUrl.toString();
    if (err.name === 'CredentialsProviderError') {
      // istanbul ignore next
      logger.debug(
        { failedUrl },
        'Dependency lookup authorization failed. Please correct AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env vars'
      );
    } else if (err.message === 'Region is missing') {
      // istanbul ignore next
      logger.debug(
        { failedUrl },
        'Dependency lookup failed. Please a correct AWS_REGION env var'
      );
    } else if (isS3NotFound(err)) {
      logger.trace({ failedUrl }, `S3 url not found`);
    } /* istanbul ignore next */ else {
      // istanbul ignore next
      logger.info(
        { failedUrl, message: err.message },
        'Unknown S3 download error'
      );
    }
  }
  return '';
}

async function checkHttpResource(
  http: Http,
  pkgUrl: url.URL | string
): Promise<HttpResourceCheckResult> {
  try {
    const res = await http.head(pkgUrl.toString());
    const timestamp = res?.headers?.['last-modified'];
    if (timestamp) {
      const isoTimestamp = normalizeDate(timestamp);
      if (isoTimestamp) {
        const releaseDate = DateTime.fromISO(isoTimestamp, {
          zone: 'UTC',
        }).toJSDate();
        return releaseDate;
      }
    }
    return 'found';
  } catch (err) {
    if (isNotFoundError(err)) {
      return 'not-found';
    }

    const failedUrl = pkgUrl.toString();
    logger.debug(
      { failedUrl, statusCode: err.statusCode },
      `Can't check HTTP resource existence`
    );
    return 'error';
  }
}

async function checkS3Resource(
  pkgUrl: URL | string
): Promise<HttpResourceCheckResult> {
  try {
    const s3Url = parseS3Url(pkgUrl.toString());
    // istanbul ignore next
    if (s3Url === null) {
      return 'error';
    }
    const response = await getS3Client().headObject(s3Url);
    // istanbul ignore next
    if (response.DeleteMarker) {
      return 'not-found';
    }
    if (response.LastModified) {
      return response.LastModified;
    }
    return 'found';
  } catch (err) {
    if (isS3NotFound(err)) {
      return 'not-found';
    } /* istanbul ignore next */ else {
      // istanbul ignore next
      logger.debug(
        { pkgUrl, name: err.name, message: err.message },
        `Can't check S3 resource existence`
      );
    }
    // istanbul ignore next
    return 'error';
  }
}

export async function checkResource(
  http: Http,
  pkgUrl: url.URL | string
): Promise<HttpResourceCheckResult> {
  const parsedUrl = typeof pkgUrl === 'string' ? parseUrl(pkgUrl) : pkgUrl;
  // istanbul ignore next
  if (parsedUrl === null) {
    return 'error';
  }
  switch (parsedUrl.protocol) {
    case 'http:':
    case 'https:':
      return await checkHttpResource(http, parsedUrl);
    case 's3:':
      return await checkS3Resource(pkgUrl as url.URL);
    /* istanbul ignore next */
    default:
      logger.debug(
        { url: pkgUrl.toString() },
        `Unsupported Maven protocol in check resource`
      );
      return 'not-found';
  }
}

function containsPlaceholder(str: string): boolean {
  return regEx(/\${.*?}/g).test(str);
}

export function getMavenUrl(
  dependency: MavenDependency,
  repoUrl: string,
  path: string
): url.URL {
  return new url.URL(`${dependency.dependencyUrl}/${path}`, repoUrl);
}

export async function downloadMavenXml(
  http: Http,
  pkgUrl: url.URL | null
): Promise<MavenXml> {
  /* istanbul ignore if */
  if (!pkgUrl) {
    return {};
  }
  let rawContent: string | undefined;
  let authorization: boolean | undefined;
  let statusCode: number | undefined;
  switch (pkgUrl.protocol) {
    case 'http:':
    case 'https:':
      ({
        authorization,
        body: rawContent,
        statusCode,
      } = await downloadHttpProtocol(http, pkgUrl));
      break;
    case 's3:':
      rawContent = await downloadS3Protocol(pkgUrl);
      break;
    default:
      logger.debug({ url: pkgUrl.toString() }, `Unsupported Maven protocol`);
      return {};
  }

  if (!rawContent) {
    logger.debug(
      { url: pkgUrl.toString(), statusCode },
      `Content is not found for Maven url`
    );
    return {};
  }

  return { authorization, xml: new XmlDocument(rawContent) };
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

export async function getDependencyInfo(
  http: Http,
  dependency: MavenDependency,
  repoUrl: string,
  version: string,
  recursionLimit = 5
): Promise<Partial<ReleaseResult>> {
  const result: Partial<ReleaseResult> = {};
  const path = `${version}/${dependency.name}-${version}.pom`;

  const pomUrl = getMavenUrl(dependency, repoUrl, path);
  const { xml: pomContent } = await downloadMavenXml(http, pomUrl);
  // istanbul ignore if
  if (!pomContent) {
    return result;
  }

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
      .replace(regEx(/^git@github.com\//), 'https://github.com/')
      .replace(regEx(/\.git$/), '');

    if (result.sourceUrl.startsWith('//')) {
      // most likely the result of us stripping scm:, git: etc
      // going with prepending https: here which should result in potential information retrival
      result.sourceUrl = `https:${result.sourceUrl}`;
    }
  }

  const parent = pomContent.childNamed('parent');
  if (recursionLimit > 0 && parent && (!result.sourceUrl || !result.homepage)) {
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
        recursionLimit - 1
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
}

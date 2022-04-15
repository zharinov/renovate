import { Readable } from 'stream';
import type { S3 } from '@aws-sdk/client-s3';
import { afterEach } from '@jest/globals';
import type { S3UrlParts } from '../lib/util/s3';

let mockedObjects: Record<string, string> = {};
let mockedTimestamps: Record<string, string> = {};
let mockedDeletes: Array<string> = [];
let mockedError: Error | null = null;
let mockedErrors: Record<string, Error> = {};

function objectKey(url: S3UrlParts) {
  return `s3://${url.Bucket}/${url.Key}`;
}

function headObject(url: S3UrlParts) {
  if (mockedError) {
    return Promise.reject(mockedError);
  }
  const k = objectKey(url);
  if (mockedErrors[k]) {
    return Promise.reject(mockedErrors[k]);
  }
  if (mockedDeletes.includes(k)) {
    return Promise.resolve({ DeleteMarker: true });
  }
  if (mockedObjects[k] === undefined) {
    return Promise.reject({ message: 'NotFound' });
  }
  const LastModified = mockedTimestamps[k];
  return Promise.resolve({ LastModified });
}

function getObject(url: S3UrlParts) {
  if (mockedError) {
    return Promise.reject(mockedError);
  }
  const k = objectKey(url);
  if (mockedErrors[k]) {
    return Promise.reject(mockedErrors[k]);
  }
  if (mockedDeletes.includes(k)) {
    return Promise.resolve({ DeleteMarker: true });
  }
  if (!mockedObjects[k]) {
    return Promise.reject({ message: 'NotFound' });
  }
  const Body = new Readable();
  const content = mockedObjects[k];
  if (typeof content === 'string') {
    Body.push(content);
  }
  Body.push(null);
  const LastModified = mockedTimestamps[k];
  return Promise.resolve({ Body, LastModified });
}

function mockObject(url: string, content?: string, headers?: any) {
  mockedObjects[url] = content ? content : '';
  if (headers?.['Last-Modified']) {
    mockedTimestamps[url] = headers['Last-Modified'];
  }
}

function mockDelete(url: string) {
  mockedDeletes.push(url);
}

function mockError(err: Error, url?: string) {
  if (url) {
    mockedErrors[url] = err;
  } else {
    mockedError = err;
  }
}

const s3mock = {
  headObject,
  getObject,
  mockObject,
  mockDelete,
  mockError,
};
export { s3mock };

jest.mock('@aws-sdk/client-s3', () => ({
  S3: function (this: S3) {
    return { ...this, ...s3mock };
  },
}));

afterEach(() => {
  mockedObjects = {};
  mockedTimestamps = {};
  mockedDeletes = [];
  mockedError = null;
  mockedErrors = {};
});

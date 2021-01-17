import { VersioningApi } from '../common';
import maven from '../maven';
import { isSubversion } from '../maven/compare';
import {
  REV_TYPE_LATEST,
  REV_TYPE_SUBREV,
  parseDynamicRevision,
} from './parse';

export const id = 'ivy';
export const displayName = 'Ivy';
export const urls = ['https://ant.apache.org/ivy/'];
export const supportsRanges = true;
export const supportedRangeStrategies = ['bump', 'extend', 'pin', 'replace'];

// eslint-disable-next-line @typescript-eslint/unbound-method
const {
  equals,
  getMajor,
  getMinor,
  getPatch,
  isGreaterThan,
  isSingleVersion,
  isStable,
  matches: mavenMatches,
  getSatisfyingVersion,
  minSatisfyingVersion,
  getNewValue,
  sortVersions,
} = maven;

function isVersion(str: string): string | boolean {
  if (!str) {
    return false;
  }
  return isSingleVersion(str) || !!parseDynamicRevision(str);
}

function matches(a: string, b: string): boolean {
  if (!a) {
    return false;
  }
  if (!b) {
    return false;
  }
  const dynamicRevision = parseDynamicRevision(b);
  if (!dynamicRevision) {
    return equals(a, b);
  }
  const { type, value } = dynamicRevision;

  if (type === REV_TYPE_LATEST) {
    return false;
  }

  if (type === REV_TYPE_SUBREV) {
    return isSubversion(value, a);
  }

  return mavenMatches(a, value);
}

export const api: VersioningApi = {
  equals,
  getMajor,
  getMinor,
  getPatch,
  isCompatible: isVersion,
  isGreaterThan,
  isSingleVersion,
  isStable,
  isValid: isVersion,
  isVersion,
  matches,
  getSatisfyingVersion,
  minSatisfyingVersion,
  getNewValue,
  sortVersions,
};

export default api;

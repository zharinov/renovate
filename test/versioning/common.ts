import { NewValueConfig } from '../../lib/versioning';

export interface NewValueTestConfig extends NewValueConfig {
  title?: string;
  expectedValue: string;
}

export interface MinMaxSatisfyingSampleElem {
  versionList: string[];
  range: string;
  min: string | null;
  max: string | null;
}

export function getNewValueTestSuite(
  getNewValue: (NewValueConfig) => string | null
) {
  return newValueTestConfig => {
    const {
      title,
      fromVersion,
      toVersion,
      currentValue,
      rangeStrategy,
      expectedValue,
    } = newValueTestConfig;
    const testTitle =
      title ||
      `Between ${fromVersion} and ${toVersion} versions, "${rangeStrategy}" for ${currentValue} equals ${expectedValue}`;
    it(testTitle, () => {
      expect(getNewValue(newValueTestConfig)).toEqual(expectedValue);
    });
  };
}

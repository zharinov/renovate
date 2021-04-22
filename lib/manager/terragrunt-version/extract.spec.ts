import { testName } from '../../../test/util';
import { extractPackageFile } from './extract';

describe(testName(), () => {
  describe('extractPackageFile()', () => {
    it('returns a result', () => {
      const res = extractPackageFile('12.0.0\n');
      expect(res.deps).toMatchSnapshot();
    });
  });
});

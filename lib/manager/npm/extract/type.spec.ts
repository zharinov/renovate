import { testName } from '../../../../test/util';
import { mightBeABrowserLibrary } from './type';

describe(testName(), () => {
  describe('.mightBeABrowserLibrary()', () => {
    it('is not a library if private', () => {
      const isLibrary = mightBeABrowserLibrary({ private: true });
      expect(isLibrary).toBe(false);
    });
    it('is not a library if no main', () => {
      const isLibrary = mightBeABrowserLibrary({});
      expect(isLibrary).toBe(false);
    });
    it('is a library if has a main', () => {
      const isLibrary = mightBeABrowserLibrary({ main: 'index.js ' });
      expect(isLibrary).toBe(true);
    });
  });
});

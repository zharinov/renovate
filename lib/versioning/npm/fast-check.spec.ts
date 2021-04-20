import fc from 'fast-check';
import { getName } from '../../../test/util';
import { api as semver } from '.';

interface RawVersion {
  major: number;
  minor: number;
  patch: number;
}

function rawToString({ major, minor, patch }: RawVersion): string {
  return `${major}.${minor}.${patch}`;
}

const rawVersionArb = fc.record({
  major: fc.nat(),
  minor: fc.nat(),
  patch: fc.nat(),
});

describe(getName(__filename), () => {
  it('works', () => {
    fc.assert(
      fc.property(rawVersionArb.map(rawToString), (version) => {
        expect(semver.isValid(version)).toBeTruthy();
      })
    );
  });
});

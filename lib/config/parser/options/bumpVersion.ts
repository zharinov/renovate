import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type BumpVersionConfigKey = 'bumpVersion';
type BumpVersionConfigValue = string;

export class BumpVersionField<
  T extends EmptyConfig,
> extends StringNullableField<T, BumpVersionConfigKey, BumpVersionConfigValue> {
  override name = 'bumpVersion' as const;

  override description = 'Bump the version in the package file being updated.';

  override allowedValues = ['major', 'minor', 'patch', 'prerelease'];
}

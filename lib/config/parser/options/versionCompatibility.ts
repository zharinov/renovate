import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type VersionCompatibilityConfigKey = 'versionCompatibility';
type VersionCompatibilityConfigValue = string;

export class VersionCompatibilityField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  VersionCompatibilityConfigKey,
  VersionCompatibilityConfigValue
> {
  override name = 'versionCompatibility' as const;

  override description =
    'A regex (`re2`) with named capture groups to show how version and compatibility are split from a raw version string.';
}

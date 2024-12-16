import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type AllowedVersionsConfigKey = 'allowedVersions';
type AllowedVersionsConfigValue = string;

export class AllowedVersionsField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  AllowedVersionsConfigKey,
  AllowedVersionsConfigValue
> {
  override name = 'allowedVersions' as const;

  override description =
    'A version range or regex pattern capturing allowed versions for dependencies.';
}

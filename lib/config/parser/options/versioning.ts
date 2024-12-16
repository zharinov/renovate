import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type VersioningConfigKey = 'versioning';
type VersioningConfigValue = string;

export class VersioningField<T extends EmptyConfig> extends StringNullableField<
  T,
  VersioningConfigKey,
  VersioningConfigValue
> {
  override name = 'versioning' as const;

  override description = 'Versioning to use for filtering and comparisons.';
}

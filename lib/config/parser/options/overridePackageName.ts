import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OverridePackageNameConfigKey = 'overridePackageName';
type OverridePackageNameConfigValue = string;

export class OverridePackageNameField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  OverridePackageNameConfigKey,
  OverridePackageNameConfigValue
> {
  override name = 'overridePackageName' as const;

  override description = 'Override the packageName value.';
}

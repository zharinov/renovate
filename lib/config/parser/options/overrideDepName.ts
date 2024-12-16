import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OverrideDepNameConfigKey = 'overrideDepName';
type OverrideDepNameConfigValue = string;

export class OverrideDepNameField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  OverrideDepNameConfigKey,
  OverrideDepNameConfigValue
> {
  override name = 'overrideDepName' as const;

  override description = 'Override the depName value.';
}

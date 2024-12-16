import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type AdditionalBranchPrefixConfigKey = 'additionalBranchPrefix';
type AdditionalBranchPrefixConfigValue = string;

export class AdditionalBranchPrefixField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  AdditionalBranchPrefixConfigKey,
  AdditionalBranchPrefixConfigValue
> {
  override name = 'additionalBranchPrefix' as const;

  override description =
    'Additional string value to be appended to `branchPrefix`.';
}

import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type BranchPrefixConfigKey = 'branchPrefix';
type BranchPrefixConfigValue = string;

export class BranchPrefixField<T extends EmptyConfig> extends StringField<
  T,
  BranchPrefixConfigKey,
  BranchPrefixConfigValue
> {
  override name = 'branchPrefix' as const;

  override description = 'Prefix to use for all branch names.';

  override defaultValue = 'renovate/' as const;
}

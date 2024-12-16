import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type BranchPrefixOldConfigKey = 'branchPrefixOld';
type BranchPrefixOldConfigValue = string;

export class BranchPrefixOldField<T extends EmptyConfig> extends StringField<
  T,
  BranchPrefixOldConfigKey,
  BranchPrefixOldConfigValue
> {
  override name = 'branchPrefixOld' as const;

  override description = 'Old branchPrefix value to check for existing PRs.';

  override defaultValue = 'renovate/' as const;
}

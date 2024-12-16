import { IntegerNullableField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type BranchConcurrentLimitConfigKey = 'branchConcurrentLimit';
type BranchConcurrentLimitConfigValue = number;

export class BranchConcurrentLimitField<
  T extends EmptyConfig,
> extends IntegerNullableField<
  T,
  BranchConcurrentLimitConfigKey,
  BranchConcurrentLimitConfigValue
> {
  override name = 'branchConcurrentLimit' as const;

  override description =
    'Limit to a maximum of x concurrent branches. 0 means no limit, `null` (default) inherits value from `prConcurrentLimit`.';
}

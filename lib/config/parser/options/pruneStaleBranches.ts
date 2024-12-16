import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PruneStaleBranchesField<
  T extends EmptyConfig,
> extends BooleanField<T, 'pruneStaleBranches'> {
  override name = 'pruneStaleBranches' as const;

  override description = 'Set to `false` to disable pruning stale branches.';

  override defaultValue = true;
}

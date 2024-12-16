import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PruneBranchAfterAutomergeField<
  T extends EmptyConfig,
> extends BooleanField<T, 'pruneBranchAfterAutomerge'> {
  override name = 'pruneBranchAfterAutomerge' as const;

  override description =
    'Set to `true` to enable branch pruning after automerging.';

  override defaultValue = true;
}

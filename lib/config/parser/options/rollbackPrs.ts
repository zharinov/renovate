import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class RollbackPrsField<T extends EmptyConfig> extends BooleanField<
  T,
  'rollbackPrs'
> {
  override name = 'rollbackPrs' as const;

  override description =
    'Create PRs to roll back versions if the current version is not found in the registry.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class UpdatePinnedDependenciesField<
  T extends EmptyConfig,
> extends BooleanField<T, 'updatePinnedDependencies'> {
  override name = 'updatePinnedDependencies' as const;

  override description =
    'Whether to update pinned (single version) dependencies or not.';

  override defaultValue = true;
}

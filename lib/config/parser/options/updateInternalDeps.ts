import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class UpdateInternalDepsField<
  T extends EmptyConfig,
> extends BooleanField<T, 'updateInternalDeps'> {
  override name = 'updateInternalDeps' as const;

  override description =
    'Whether to update internal dep versions in a monorepo. Works on Yarn Workspaces.';

  override defaultValue = false;
}

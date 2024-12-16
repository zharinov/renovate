import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ForkModeDisallowMaintainerEditsField<
  T extends EmptyConfig,
> extends BooleanField<T, 'forkModeDisallowMaintainerEdits'> {
  override name = 'forkModeDisallowMaintainerEdits' as const;

  override description =
    'Disallow maintainers to push to Renovate pull requests when running in fork mode.';

  override defaultValue = false;
}

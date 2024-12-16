import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AllowPostUpgradeCommandTemplatingField<
  T extends EmptyConfig,
> extends BooleanField<T, 'allowPostUpgradeCommandTemplating'> {
  override name = 'allowPostUpgradeCommandTemplating' as const;

  override description =
    'Set this to `false` to disable template compilation for post-upgrade commands.';

  override defaultValue = true;
}

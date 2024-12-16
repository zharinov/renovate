import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class EnabledField<T extends EmptyConfig> extends BooleanField<
  T,
  'enabled'
> {
  override name = 'enabled' as const;

  override description = 'Enable or disable Renovate bot.';

  override defaultValue = true;
}

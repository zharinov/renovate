import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class EnabledField<T extends EmptyConfig> extends BooleanField<
  T,
  'enabled'
> {
  override field = 'enabled' as const;
  override defaultValue = true;
}

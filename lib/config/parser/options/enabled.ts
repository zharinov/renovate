import { BooleanField } from '../base/boolean-field';

export class EnabledField<T> extends BooleanField<T, 'enabled'> {
  override field = 'enabled' as const;
  override defaultValue = true;
}

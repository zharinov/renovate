import { BooleanField } from '../base/boolean-field';

export class EnabledField<T> extends BooleanField<T, 'enabled'> {
  field = 'enabled' as const;
  override defaultValue = true;
}

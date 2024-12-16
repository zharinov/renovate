import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CustomTypeConfigKey = 'customType';
type CustomTypeConfigValue = string;

export class CustomTypeField<T extends EmptyConfig> extends StringNullableField<
  T,
  CustomTypeConfigKey,
  CustomTypeConfigValue
> {
  override name = 'customType' as const;

  override description =
    'Custom manager to use. Valid only within a `customManagers` object.';

  override allowedValues = ['regex'];
}

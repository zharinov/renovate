import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CurrentValueTemplateConfigKey = 'currentValueTemplate';
type CurrentValueTemplateConfigValue = string;

export class CurrentValueTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  CurrentValueTemplateConfigKey,
  CurrentValueTemplateConfigValue
> {
  override name = 'currentValueTemplate' as const;

  override description =
    'Optional `currentValue` for extracted dependencies. Valid only within a `customManagers` object.';
}

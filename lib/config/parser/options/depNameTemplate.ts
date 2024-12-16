import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DepNameTemplateConfigKey = 'depNameTemplate';
type DepNameTemplateConfigValue = string;

export class DepNameTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  DepNameTemplateConfigKey,
  DepNameTemplateConfigValue
> {
  override name = 'depNameTemplate' as const;

  override description =
    'Optional depName for extracted dependencies. Valid only within a `customManagers` object.';
}

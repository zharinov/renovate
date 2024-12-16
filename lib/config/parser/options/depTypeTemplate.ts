import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DepTypeTemplateConfigKey = 'depTypeTemplate';
type DepTypeTemplateConfigValue = string;

export class DepTypeTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  DepTypeTemplateConfigKey,
  DepTypeTemplateConfigValue
> {
  override name = 'depTypeTemplate' as const;

  override description =
    'Optional `depType` for extracted dependencies. Valid only within a `customManagers` object.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DatasourceTemplateConfigKey = 'datasourceTemplate';
type DatasourceTemplateConfigValue = string;

export class DatasourceTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  DatasourceTemplateConfigKey,
  DatasourceTemplateConfigValue
> {
  override name = 'datasourceTemplate' as const;

  override description =
    'Optional datasource for extracted dependencies. Valid only within a `customManagers` object.';
}

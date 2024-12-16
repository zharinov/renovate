import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OverrideDatasourceConfigKey = 'overrideDatasource';
type OverrideDatasourceConfigValue = string;

export class OverrideDatasourceField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  OverrideDatasourceConfigKey,
  OverrideDatasourceConfigValue
> {
  override name = 'overrideDatasource' as const;

  override description = 'Override the datasource value.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type HostTypeConfigKey = 'hostType';
type HostTypeConfigValue = string;

export class HostTypeField<T extends EmptyConfig> extends StringNullableField<
  T,
  HostTypeConfigKey,
  HostTypeConfigValue
> {
  override name = 'hostType' as const;

  override description =
    'hostType for a package rule. Can be a platform name or a datasource name.';
}

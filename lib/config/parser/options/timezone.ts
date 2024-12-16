import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type TimezoneConfigKey = 'timezone';
type TimezoneConfigValue = string;

export class TimezoneField<T extends EmptyConfig> extends StringNullableField<
  T,
  TimezoneConfigKey,
  TimezoneConfigValue
> {
  override name = 'timezone' as const;

  override description =
    'Must conform to [IANA Time Zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) format.';
}

import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type TimeoutConfigKey = 'timeout';
type TimeoutConfigValue = number;

export class TimeoutField<T extends EmptyConfig> extends IntegerField<
  T,
  TimeoutConfigKey,
  TimeoutConfigValue
> {
  override name = 'timeout' as const;

  override description =
    'Timeout (in milliseconds) for queries to external endpoints.';

  override defaultValue = 60000;
}

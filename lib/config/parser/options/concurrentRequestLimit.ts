import { IntegerNullableField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type ConcurrentRequestLimitConfigKey = 'concurrentRequestLimit';
type ConcurrentRequestLimitConfigValue = number;

export class ConcurrentRequestLimitField<
  T extends EmptyConfig,
> extends IntegerNullableField<
  T,
  ConcurrentRequestLimitConfigKey,
  ConcurrentRequestLimitConfigValue
> {
  override name = 'concurrentRequestLimit' as const;

  override description = 'Limit concurrent requests per host.';
}

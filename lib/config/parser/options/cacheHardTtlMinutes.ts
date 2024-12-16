import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type CacheHardTtlMinutesConfigKey = 'cacheHardTtlMinutes';
type CacheHardTtlMinutesConfigValue = number;

export class CacheHardTtlMinutesField<
  T extends EmptyConfig,
> extends IntegerField<
  T,
  CacheHardTtlMinutesConfigKey,
  CacheHardTtlMinutesConfigValue
> {
  override name = 'cacheHardTtlMinutes' as const;

  override description =
    'Maximum duration in minutes to keep datasource cache entries.';

  override defaultValue = 10080; // 7 * 24 * 60
}

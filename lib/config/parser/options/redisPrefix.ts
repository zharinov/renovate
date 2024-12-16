import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type RedisPrefixConfigKey = 'redisPrefix';
type RedisPrefixConfigValue = string;

export class RedisPrefixField<
  T extends EmptyConfig,
> extends StringNullableField<T, RedisPrefixConfigKey, RedisPrefixConfigValue> {
  override name = 'redisPrefix' as const;

  override description = 'Key prefix for redis cache entries.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type RedisUrlConfigKey = 'redisUrl';
type RedisUrlConfigValue = string;

export class RedisUrlField<T extends EmptyConfig> extends StringNullableField<
  T,
  RedisUrlConfigKey,
  RedisUrlConfigValue
> {
  override name = 'redisUrl' as const;

  override description =
    'If set, this Redis URL will be used for caching instead of the file system.';
}

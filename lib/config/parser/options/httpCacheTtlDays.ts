import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type HttpCacheTtlDaysConfigKey = 'httpCacheTtlDays';
type HttpCacheTtlDaysConfigValue = number;

export class HttpCacheTtlDaysField<T extends EmptyConfig> extends IntegerField<
  T,
  HttpCacheTtlDaysConfigKey,
  HttpCacheTtlDaysConfigValue
> {
  override name = 'httpCacheTtlDays' as const;

  override description = 'Maximum duration in days to keep HTTP cache entries.';

  override defaultValue = 90;
}

import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type MaxRetryAfterConfigKey = 'maxRetryAfter';
type MaxRetryAfterConfigValue = number;

export class MaxRetryAfterField<T extends EmptyConfig> extends IntegerField<
  T,
  MaxRetryAfterConfigKey,
  MaxRetryAfterConfigValue
> {
  override name = 'maxRetryAfter' as const;

  override description =
    'Maximum retry-after header value to wait for before retrying a failed request.';

  override defaultValue = 60;
}

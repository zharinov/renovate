import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type PrConcurrentLimitConfigKey = 'prConcurrentLimit';
type PrConcurrentLimitConfigValue = number;

export class PrConcurrentLimitField<T extends EmptyConfig> extends IntegerField<
  T,
  PrConcurrentLimitConfigKey,
  PrConcurrentLimitConfigValue
> {
  override name = 'prConcurrentLimit' as const;

  override description =
    'Limit to a maximum of x concurrent branches/PRs. 0 means no limit.';

  override defaultValue = 10;
}

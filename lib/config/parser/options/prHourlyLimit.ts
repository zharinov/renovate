import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type PrHourlyLimitConfigKey = 'prHourlyLimit';
type PrHourlyLimitConfigValue = number;

export class PrHourlyLimitField<T extends EmptyConfig> extends IntegerField<
  T,
  PrHourlyLimitConfigKey,
  PrHourlyLimitConfigValue
> {
  override name = 'prHourlyLimit' as const;

  override description =
    'Rate limit PRs to maximum x created per hour. 0 means no limit.';

  override defaultValue = 2;
}

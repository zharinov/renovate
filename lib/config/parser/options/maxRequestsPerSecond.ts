import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type MaxRequestsPerSecondConfigKey = 'maxRequestsPerSecond';
type MaxRequestsPerSecondConfigValue = number;

export class MaxRequestsPerSecondField<
  T extends EmptyConfig,
> extends IntegerField<
  T,
  MaxRequestsPerSecondConfigKey,
  MaxRequestsPerSecondConfigValue
> {
  override name = 'maxRequestsPerSecond' as const;

  override description = 'Limit requests rate per host.';

  override defaultValue = 0;
}

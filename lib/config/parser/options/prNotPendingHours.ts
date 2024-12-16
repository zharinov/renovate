import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type PrNotPendingHoursConfigKey = 'prNotPendingHours';
type PrNotPendingHoursConfigValue = number;

export class PrNotPendingHoursField<T extends EmptyConfig> extends IntegerField<
  T,
  PrNotPendingHoursConfigKey,
  PrNotPendingHoursConfigValue
> {
  override name = 'prNotPendingHours' as const;

  override description = 'Timeout in hours for when `prCreation=not-pending`.';

  override defaultValue = 25;
}

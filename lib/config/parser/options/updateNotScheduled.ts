import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class UpdateNotScheduledField<
  T extends EmptyConfig,
> extends BooleanField<T, 'updateNotScheduled'> {
  override name = 'updateNotScheduled' as const;

  override description =
    'Whether to update branches when not scheduled. Renovate will not create branches outside of the schedule.';

  override defaultValue = true;
}

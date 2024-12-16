import { IntegerNullableField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type AssigneesSampleSizeConfigKey = 'assigneesSampleSize';
type AssigneesSampleSizeConfigValue = number;

export class AssigneesSampleSizeField<
  T extends EmptyConfig,
> extends IntegerNullableField<
  T,
  AssigneesSampleSizeConfigKey,
  AssigneesSampleSizeConfigValue
> {
  override name = 'assigneesSampleSize' as const;

  override description = 'Take a random sample of given size from `assignees`.';
}

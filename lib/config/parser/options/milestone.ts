import { IntegerNullableField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type MilestoneConfigKey = 'milestone';
type MilestoneConfigValue = number;

export class MilestoneField<T extends EmptyConfig> extends IntegerNullableField<
  T,
  MilestoneConfigKey,
  MilestoneConfigValue
> {
  override name = 'milestone' as const;

  override description =
    'The number of a milestone. If set, the milestone will be set when Renovate creates the PR.';
}

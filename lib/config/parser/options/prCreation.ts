import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const prCreationValues = [
  'immediate',
  'not-pending',
  'status-success',
  'approval',
] as const;

type PrCreationConfigKey = 'prCreation';
type PrCreationConfigValue = (typeof prCreationValues)[number];

export class PrCreationField<T extends EmptyConfig> extends StringField<
  T,
  PrCreationConfigKey,
  PrCreationConfigValue
> {
  override name = 'prCreation' as const;

  override description = 'When to create the PR for a branch.';

  override defaultValue = 'immediate' as const;

  override allowedValues = [...prCreationValues];
}

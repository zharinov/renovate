import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type PrPriorityConfigKey = 'prPriority';
type PrPriorityConfigValue = number;

export class PrPriorityField<T extends EmptyConfig> extends IntegerField<
  T,
  PrPriorityConfigKey,
  PrPriorityConfigValue
> {
  override name = 'prPriority' as const;

  override description =
    'Set sorting priority for PR creation. PRs with higher priority are created first, negative priority last.';

  override defaultValue = 0;

  protected override allowNegative = true;
}

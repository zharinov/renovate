import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const rangeStrategyValues = [
  'auto',
  'pin',
  'bump',
  'replace',
  'widen',
  'update-lockfile',
  'in-range-only',
] as const;

type RangeStrategyConfigKey = 'rangeStrategy';
type RangeStrategyConfigValue = (typeof rangeStrategyValues)[number];

export class RangeStrategyField<T extends EmptyConfig> extends StringField<
  T,
  RangeStrategyConfigKey,
  RangeStrategyConfigValue
> {
  override name = 'rangeStrategy' as const;

  override description = 'Determines how to modify or update existing ranges.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...rangeStrategyValues];
}

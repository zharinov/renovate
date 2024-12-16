import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const matchStringsStrategyValues = ['any', 'recursive', 'combination'] as const;

type MatchStringsStrategyConfigKey = 'matchStringsStrategy';
type MatchStringsStrategyConfigValue =
  (typeof matchStringsStrategyValues)[number];

export class MatchStringsStrategyField<
  T extends EmptyConfig,
> extends StringField<
  T,
  MatchStringsStrategyConfigKey,
  MatchStringsStrategyConfigValue
> {
  override name = 'matchStringsStrategy' as const;

  override description = 'Strategy how to interpret matchStrings.';

  override defaultValue = 'any' as const;

  override allowedValues = [...matchStringsStrategyValues];
}

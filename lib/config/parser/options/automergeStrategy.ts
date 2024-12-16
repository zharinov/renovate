import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const automergeStrategyValues = [
  'auto',
  'fast-forward',
  'merge-commit',
  'rebase',
  'squash',
] as const;

type AutomergeStrategyConfigKey = 'automergeStrategy';
type AutomergeStrategyConfigValue = (typeof automergeStrategyValues)[number];

export class AutomergeStrategyField<T extends EmptyConfig> extends StringField<
  T,
  AutomergeStrategyConfigKey,
  AutomergeStrategyConfigValue
> {
  override name = 'automergeStrategy' as const;

  override description =
    'The merge strategy to use when automerging PRs. Used only if `automergeType=pr`.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...automergeStrategyValues];
}

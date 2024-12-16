import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const automergeTypeValues = ['branch', 'pr', 'pr-comment'] as const;

type AutomergeTypeConfigKey = 'automergeType';
type AutomergeTypeConfigValue = (typeof automergeTypeValues)[number];

export class AutomergeTypeField<T extends EmptyConfig> extends StringField<
  T,
  AutomergeTypeConfigKey,
  AutomergeTypeConfigValue
> {
  override name = 'automergeType' as const;

  override description = 'How to automerge, if enabled.';

  override defaultValue = 'pr' as const;

  override allowedValues = [...automergeTypeValues];
}

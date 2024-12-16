import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type AutomergeCommentConfigKey = 'automergeComment';
type AutomergeCommentConfigValue = string;

export class AutomergeCommentField<T extends EmptyConfig> extends StringField<
  T,
  AutomergeCommentConfigKey,
  AutomergeCommentConfigValue
> {
  override name = 'automergeComment' as const;

  override description =
    'PR comment to add to trigger automerge. Only used if `automergeType=pr-comment`.';

  override defaultValue = 'automergeComment' as const;
}

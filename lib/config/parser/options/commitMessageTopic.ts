import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitMessageTopicConfigKey = 'commitMessageTopic';
type CommitMessageTopicConfigValue = string;

export class CommitMessageTopicField<T extends EmptyConfig> extends StringField<
  T,
  CommitMessageTopicConfigKey,
  CommitMessageTopicConfigValue
> {
  override name = 'commitMessageTopic' as const;

  override description =
    'The upgrade topic/noun used in commit messages and PR titles.';

  override defaultValue = 'dependency {{depName}}' as const;
}

import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitMessageConfigKey = 'commitMessage';
type CommitMessageConfigValue = string;

export class CommitMessageField<T extends EmptyConfig> extends StringField<
  T,
  CommitMessageConfigKey,
  CommitMessageConfigValue
> {
  override name = 'commitMessage' as const;

  override description =
    'Message to use for commit messages and pull request titles.';

  override defaultValue =
    '{{{commitMessagePrefix}}} {{{commitMessageAction}}} {{{commitMessageTopic}}} {{{commitMessageExtra}}} {{{commitMessageSuffix}}}' as const;
}

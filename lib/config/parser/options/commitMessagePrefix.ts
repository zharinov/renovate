import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitMessagePrefixConfigKey = 'commitMessagePrefix';
type CommitMessagePrefixConfigValue = string;

export class CommitMessagePrefixField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  CommitMessagePrefixConfigKey,
  CommitMessagePrefixConfigValue
> {
  override name = 'commitMessagePrefix' as const;

  override description =
    'Prefix to add to start of commit messages and PR titles. Uses a semantic prefix if `semanticCommits` is enabled.';
}

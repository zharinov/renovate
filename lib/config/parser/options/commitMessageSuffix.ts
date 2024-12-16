import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitMessageSuffixConfigKey = 'commitMessageSuffix';
type CommitMessageSuffixConfigValue = string;

export class CommitMessageSuffixField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  CommitMessageSuffixConfigKey,
  CommitMessageSuffixConfigValue
> {
  override name = 'commitMessageSuffix' as const;

  override description =
    'Suffix to add to end of commit messages and PR titles.';
}

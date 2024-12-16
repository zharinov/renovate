import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type GitAuthorConfigKey = 'gitAuthor';
type GitAuthorConfigValue = string;

export class GitAuthorField<T extends EmptyConfig> extends StringNullableField<
  T,
  GitAuthorConfigKey,
  GitAuthorConfigValue
> {
  override name = 'gitAuthor' as const;

  override description =
    'Author to use for Git commits. Must conform to [RFC5322](https://datatracker.ietf.org/doc/html/rfc5322).';
}

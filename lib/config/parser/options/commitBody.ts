import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitBodyConfigKey = 'commitBody';
type CommitBodyConfigValue = string;

export class CommitBodyField<T extends EmptyConfig> extends StringNullableField<
  T,
  CommitBodyConfigKey,
  CommitBodyConfigValue
> {
  override name = 'commitBody' as const;

  override description =
    'Commit message body template. Will be appended to commit message, separated by two line returns.';
}

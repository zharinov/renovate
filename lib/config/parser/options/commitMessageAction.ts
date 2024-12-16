import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitMessageActionConfigKey = 'commitMessageAction';
type CommitMessageActionConfigValue = string;

export class CommitMessageActionField<
  T extends EmptyConfig,
> extends StringField<
  T,
  CommitMessageActionConfigKey,
  CommitMessageActionConfigValue
> {
  override name = 'commitMessageAction' as const;

  override description = 'Action verb to use in commit messages and PR titles.';

  override defaultValue = 'Update' as const;
}

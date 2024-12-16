import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const commitMessageLowerCaseValues = ['auto', 'never'] as const;

type CommitMessageLowerCaseConfigKey = 'commitMessageLowerCase';
type CommitMessageLowerCaseConfigValue =
  (typeof commitMessageLowerCaseValues)[number];

export class CommitMessageLowerCaseField<
  T extends EmptyConfig,
> extends StringField<
  T,
  CommitMessageLowerCaseConfigKey,
  CommitMessageLowerCaseConfigValue
> {
  override name = 'commitMessageLowerCase' as const;

  override description = 'Lowercase PR- and commit titles.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...commitMessageLowerCaseValues];
}

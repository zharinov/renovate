import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type SemanticCommitTypeConfigKey = 'semanticCommitType';
type SemanticCommitTypeConfigValue = string;

export class SemanticCommitTypeField<T extends EmptyConfig> extends StringField<
  T,
  SemanticCommitTypeConfigKey,
  SemanticCommitTypeConfigValue
> {
  override name = 'semanticCommitType' as const;

  override description = 'Commit type to use if Semantic Commits is enabled.';

  override defaultValue = 'chore' as const;
}

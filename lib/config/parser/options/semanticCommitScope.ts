import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type SemanticCommitScopeConfigKey = 'semanticCommitScope';
type SemanticCommitScopeConfigValue = string;

export class SemanticCommitScopeField<
  T extends EmptyConfig,
> extends StringField<
  T,
  SemanticCommitScopeConfigKey,
  SemanticCommitScopeConfigValue
> {
  override name = 'semanticCommitScope' as const;

  override description = 'Commit scope to use if Semantic Commits are enabled.';

  override defaultValue = 'deps' as const;
}

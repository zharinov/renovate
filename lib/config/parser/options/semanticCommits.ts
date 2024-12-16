import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const semanticCommitsValues = ['auto', 'enabled', 'disabled'] as const;

type SemanticCommitsConfigKey = 'semanticCommits';
type SemanticCommitsConfigValue = (typeof semanticCommitsValues)[number];

export class SemanticCommitsField<T extends EmptyConfig> extends StringField<
  T,
  SemanticCommitsConfigKey,
  SemanticCommitsConfigValue
> {
  override name = 'semanticCommits' as const;

  override description =
    'Enable Semantic Commit prefixes for commits and PR titles.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...semanticCommitsValues];
}

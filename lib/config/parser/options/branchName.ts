import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type BranchNameConfigKey = 'branchName';
type BranchNameConfigValue = string;

export class BranchNameField<T extends EmptyConfig> extends StringField<
  T,
  BranchNameConfigKey,
  BranchNameConfigValue
> {
  override name = 'branchName' as const;

  override description = 'Branch name template.';

  override defaultValue =
    '{{{branchPrefix}}}{{{additionalBranchPrefix}}}{{{branchTopic}}}' as const;
}

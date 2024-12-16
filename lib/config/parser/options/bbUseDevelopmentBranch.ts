import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class BbUseDevelopmentBranchField<
  T extends EmptyConfig,
> extends BooleanField<T, 'bbUseDevelopmentBranch'> {
  override name = 'bbUseDevelopmentBranch' as const;

  override description =
    "Use the repository's [development branch](https://support.atlassian.com/bitbucket-cloud/docs/branch-a-repository/#The-branching-model) as the repository's default branch.";

  override defaultValue = false;
}

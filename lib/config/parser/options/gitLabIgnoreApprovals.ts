import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class GitLabIgnoreApprovalsField<
  T extends EmptyConfig,
> extends BooleanField<T, 'gitLabIgnoreApprovals'> {
  override name = 'gitLabIgnoreApprovals' as const;

  override description =
    'Ignore approval rules for MRs created by Renovate, which is useful for automerge.';

  override defaultValue = false;
}

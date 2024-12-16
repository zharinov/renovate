import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AssignAutomergeField<T extends EmptyConfig> extends BooleanField<
  T,
  'assignAutomerge'
> {
  override name = 'assignAutomerge' as const;

  override description =
    'Assign reviewers and assignees even if the PR is to be automerged.';

  override defaultValue = false;
}

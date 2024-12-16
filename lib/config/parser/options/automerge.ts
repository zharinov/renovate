import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AutomergeField<T extends EmptyConfig> extends BooleanField<
  T,
  'automerge'
> {
  override name = 'automerge' as const;

  override description =
    'Whether to automerge branches/PRs automatically, without human intervention.';

  override defaultValue = false;
}

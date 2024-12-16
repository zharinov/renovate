import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AutoApproveField<T extends EmptyConfig> extends BooleanField<
  T,
  'autoApprove'
> {
  override name = 'autoApprove' as const;

  override description = 'Set to `true` to automatically approve PRs.';

  override defaultValue = false;
}

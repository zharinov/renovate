import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ConfigWarningReuseIssueField<
  T extends EmptyConfig,
> extends BooleanField<T, 'configWarningReuseIssue'> {
  override name = 'configWarningReuseIssue' as const;

  override description =
    'Set this to `false` to make Renovate create a new issue for each config warning, instead of reopening or reusing an existing issue.';

  override defaultValue = true;
}

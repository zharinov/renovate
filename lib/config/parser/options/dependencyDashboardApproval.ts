import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DependencyDashboardApprovalField<
  T extends EmptyConfig,
> extends BooleanField<T, 'dependencyDashboardApproval'> {
  override name = 'dependencyDashboardApproval' as const;

  override description =
    'Controls if updates need manual approval from the Dependency Dashboard issue before PRs are created.';

  override defaultValue = false;
}

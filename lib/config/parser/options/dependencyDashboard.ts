import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DependencyDashboardField<
  T extends EmptyConfig,
> extends BooleanField<T, 'dependencyDashboard'> {
  override name = 'dependencyDashboard' as const;

  override description =
    'Whether to create a "Dependency Dashboard" issue in the repository.';

  override defaultValue = false;
}

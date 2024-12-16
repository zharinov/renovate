import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DependencyDashboardAutocloseField<
  T extends EmptyConfig,
> extends BooleanField<T, 'dependencyDashboardAutoclose'> {
  override name = 'dependencyDashboardAutoclose' as const;

  override description =
    'Set to `true` to let Renovate close the Dependency Dashboard issue if there are no more updates.';

  override defaultValue = false;
}

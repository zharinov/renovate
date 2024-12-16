import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DependencyDashboardTitleConfigKey = 'dependencyDashboardTitle';
type DependencyDashboardTitleConfigValue = string;

export class DependencyDashboardTitleField<
  T extends EmptyConfig,
> extends StringField<
  T,
  DependencyDashboardTitleConfigKey,
  DependencyDashboardTitleConfigValue
> {
  override name = 'dependencyDashboardTitle' as const;

  override description = 'Title for the Dependency Dashboard issue.';

  override defaultValue = 'Dependency Dashboard' as const;
}

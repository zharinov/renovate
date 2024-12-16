import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DependencyDashboardHeaderConfigKey = 'dependencyDashboardHeader';
type DependencyDashboardHeaderConfigValue = string;

export class DependencyDashboardHeaderField<
  T extends EmptyConfig,
> extends StringField<
  T,
  DependencyDashboardHeaderConfigKey,
  DependencyDashboardHeaderConfigValue
> {
  override name = 'dependencyDashboardHeader' as const;

  override description =
    'Any text added here will be placed first in the Dependency Dashboard issue body.';

  override defaultValue =
    'This issue lists Renovate updates and detected dependencies. Read the [Dependency Dashboard](https://docs.renovatebot.com/key-concepts/dashboard/) docs to learn more.' as const;
}

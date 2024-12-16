import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DependencyDashboardFooterConfigKey = 'dependencyDashboardFooter';
type DependencyDashboardFooterConfigValue = string;

export class DependencyDashboardFooterField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  DependencyDashboardFooterConfigKey,
  DependencyDashboardFooterConfigValue
> {
  override name = 'dependencyDashboardFooter' as const;

  override description =
    'Any text added here will be placed last in the Dependency Dashboard issue body, with a divider separator before it.';
}

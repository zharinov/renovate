import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type InheritConfigRepoNameConfigKey = 'inheritConfigRepoName';
type InheritConfigRepoNameConfigValue = string;

export class InheritConfigRepoNameField<
  T extends EmptyConfig,
> extends StringField<
  T,
  InheritConfigRepoNameConfigKey,
  InheritConfigRepoNameConfigValue
> {
  override name = 'inheritConfigRepoName' as const;

  override description =
    'Renovate will look in this repo for the `inheritConfigFileName`.';

  override defaultValue = '{{parentOrg}}/renovate-config' as const;
}

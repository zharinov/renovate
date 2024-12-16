import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type InheritConfigFileNameConfigKey = 'inheritConfigFileName';
type InheritConfigFileNameConfigValue = string;

export class InheritConfigFileNameField<
  T extends EmptyConfig,
> extends StringField<
  T,
  InheritConfigFileNameConfigKey,
  InheritConfigFileNameConfigValue
> {
  override name = 'inheritConfigFileName' as const;

  override description =
    'Renovate will look for this config file name in the `inheritConfigRepoName`.';

  override defaultValue = 'org-inherited-config.json' as const;
}

import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DockerChildPrefixConfigKey = 'dockerChildPrefix';
type DockerChildPrefixConfigValue = string;

export class DockerChildPrefixField<T extends EmptyConfig> extends StringField<
  T,
  DockerChildPrefixConfigKey,
  DockerChildPrefixConfigValue
> {
  override name = 'dockerChildPrefix' as const;

  override description =
    'Change this value to add a prefix to the Renovate Docker sidecar container names and labels.';

  override defaultValue = 'renovate_' as const;
}

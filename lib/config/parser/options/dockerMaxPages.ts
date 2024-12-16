import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type DockerMaxPagesConfigKey = 'dockerMaxPages';
type DockerMaxPagesConfigValue = number;

export class DockerMaxPagesField<T extends EmptyConfig> extends IntegerField<
  T,
  DockerMaxPagesConfigKey,
  DockerMaxPagesConfigValue
> {
  override name = 'dockerMaxPages' as const;

  override description =
    'By default, Renovate fetches up to 20 pages of Docker tags from registries. But you can set your own limit with this config option.';

  override defaultValue = 20;
}

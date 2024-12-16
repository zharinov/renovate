import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type RepositoryCacheTypeConfigKey = 'repositoryCacheType';
type RepositoryCacheTypeConfigValue = string;

export class RepositoryCacheTypeField<
  T extends EmptyConfig,
> extends StringField<
  T,
  RepositoryCacheTypeConfigKey,
  RepositoryCacheTypeConfigValue
> {
  override name = 'repositoryCacheType' as const;

  override description =
    'Set the type of renovate repository cache if `repositoryCache` is enabled.';

  override defaultValue = 'local' as const;
}

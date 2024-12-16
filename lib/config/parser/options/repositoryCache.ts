import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const repositoryCacheValues = ['disabled', 'enabled', 'reset'] as const;

type RepositoryCacheConfigKey = 'repositoryCache';
type RepositoryCacheConfigValue = (typeof repositoryCacheValues)[number];

export class RepositoryCacheField<T extends EmptyConfig> extends StringField<
  T,
  RepositoryCacheConfigKey,
  RepositoryCacheConfigValue
> {
  override name = 'repositoryCache' as const;

  override description =
    'This option decides if Renovate uses a JSON cache to speed up extractions.';

  override defaultValue = 'disabled' as const;

  override allowedValues = [...repositoryCacheValues];
}

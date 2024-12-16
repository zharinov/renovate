import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class CachePrivatePackagesField<
  T extends EmptyConfig,
> extends BooleanField<T, 'cachePrivatePackages'> {
  override name = 'cachePrivatePackages' as const;

  override description =
    'Cache private packages in the datasource cache. This is useful for self-hosted setups';

  override defaultValue = false;
}

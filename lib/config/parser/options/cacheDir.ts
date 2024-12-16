import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CacheDirConfigKey = 'cacheDir';
type CacheDirConfigValue = string;

export class CacheDirField<T extends EmptyConfig> extends StringNullableField<
  T,
  CacheDirConfigKey,
  CacheDirConfigValue
> {
  override name = 'cacheDir' as const;

  override description =
    'The directory where Renovate stores its cache. If left empty, Renovate creates a subdirectory within the `baseDir`.';
}

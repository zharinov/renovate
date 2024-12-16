import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type BaseDirConfigKey = 'baseDir';
type BaseDirConfigValue = string;

export class BaseDirField<T extends EmptyConfig> extends StringNullableField<
  T,
  BaseDirConfigKey,
  BaseDirConfigValue
> {
  override name = 'baseDir' as const;

  override description =
    'The base directory for Renovate to store local files, including repository files and cache. If left empty, Renovate will create its own temporary directory to use.';
}

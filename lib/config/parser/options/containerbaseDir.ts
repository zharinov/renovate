import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ContainerbaseDirConfigKey = 'containerbaseDir';
type ContainerbaseDirConfigValue = string;

export class ContainerbaseDirField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  ContainerbaseDirConfigKey,
  ContainerbaseDirConfigValue
> {
  override name = 'containerbaseDir' as const;

  override description =
    'The directory where Renovate stores its containerbase cache. If left empty, Renovate creates a subdirectory within the `cacheDir`.';
}

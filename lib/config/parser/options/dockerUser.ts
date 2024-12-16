import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DockerUserConfigKey = 'dockerUser';
type DockerUserConfigValue = string;

export class DockerUserField<T extends EmptyConfig> extends StringNullableField<
  T,
  DockerUserConfigKey,
  DockerUserConfigValue
> {
  override name = 'dockerUser' as const;

  override description =
    'Set the `UID` and `GID` for Docker-based binaries if you use `binarySource=docker`.';
}

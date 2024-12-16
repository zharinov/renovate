import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DockerCliOptionsConfigKey = 'dockerCliOptions';
type DockerCliOptionsConfigValue = string;

export class DockerCliOptionsField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  DockerCliOptionsConfigKey,
  DockerCliOptionsConfigValue
> {
  override name = 'dockerCliOptions' as const;

  override description =
    'Pass CLI flags to `docker run` command when `binarySource=docker`.';
}

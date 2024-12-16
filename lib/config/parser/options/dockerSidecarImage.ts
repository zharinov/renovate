import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DockerSidecarImageConfigKey = 'dockerSidecarImage';
type DockerSidecarImageConfigValue = string;

export class DockerSidecarImageField<T extends EmptyConfig> extends StringField<
  T,
  DockerSidecarImageConfigKey,
  DockerSidecarImageConfigValue
> {
  override name = 'dockerSidecarImage' as const;

  override description =
    'Change this value to override the default Renovate sidecar image.';

  override defaultValue = 'ghcr.io/containerbase/sidecar:13.4.3' as const;
}

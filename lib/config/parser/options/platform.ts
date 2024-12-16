import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const platformValues = ['github', 'gitlab', 'bitbucket', 'azure'] as const;

type PlatformConfigKey = 'platform';
type PlatformConfigValue = (typeof platformValues)[number];

export class PlatformField<T extends EmptyConfig> extends StringField<
  T,
  PlatformConfigKey,
  PlatformConfigValue
> {
  override name = 'platform' as const;

  override description = 'Platform type of repository.';

  override defaultValue = 'github' as const;

  override allowedValues = [...platformValues];
}

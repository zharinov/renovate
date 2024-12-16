import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const platformCommitValues = ['auto', 'disabled', 'enabled'] as const;

type PlatformCommitConfigKey = 'platformCommit';
type PlatformCommitConfigValue = (typeof platformCommitValues)[number];

export class PlatformCommitField<T extends EmptyConfig> extends StringField<
  T,
  PlatformCommitConfigKey,
  PlatformCommitConfigValue
> {
  override name = 'platformCommit' as const;

  override description =
    'Use platform API to perform commits instead of using Git directly.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...platformCommitValues];
}

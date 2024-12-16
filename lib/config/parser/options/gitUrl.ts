import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const gitUrlValues = ['default', 'ssh', 'endpoint'] as const;

type GitUrlConfigKey = 'gitUrl';
type GitUrlConfigValue = (typeof gitUrlValues)[number];

export class GitUrlField<T extends EmptyConfig> extends StringField<
  T,
  GitUrlConfigKey,
  GitUrlConfigValue
> {
  override name = 'gitUrl' as const;

  override description =
    'Overrides the default resolution for Git remote, e.g. to switch GitLab from HTTPS to SSH-based.';

  override defaultValue = 'default' as const;

  override allowedValues = [...gitUrlValues];
}

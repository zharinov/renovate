import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type UserAgentConfigKey = 'userAgent';
type UserAgentConfigValue = string;

export class UserAgentField<T extends EmptyConfig> extends StringNullableField<
  T,
  UserAgentConfigKey,
  UserAgentConfigValue
> {
  override name = 'userAgent' as const;

  override description =
    'If set to any string, Renovate will use this as the `user-agent` it sends with HTTP requests.';
}

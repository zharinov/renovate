import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type UsernameConfigKey = 'username';
type UsernameConfigValue = string;

export class UsernameField<T extends EmptyConfig> extends StringNullableField<
  T,
  UsernameConfigKey,
  UsernameConfigValue
> {
  override name = 'username' as const;

  override description = 'Username for authentication.';
}

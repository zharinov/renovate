import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PasswordConfigKey = 'password';
type PasswordConfigValue = string;

export class PasswordField<T extends EmptyConfig> extends StringNullableField<
  T,
  PasswordConfigKey,
  PasswordConfigValue
> {
  override name = 'password' as const;

  override description = 'Password for authentication.';
}

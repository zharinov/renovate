import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type TokenConfigKey = 'token';
type TokenConfigValue = string;

export class TokenField<T extends EmptyConfig> extends StringNullableField<
  T,
  TokenConfigKey,
  TokenConfigValue
> {
  override name = 'token' as const;

  override description = 'Repository Auth Token.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MatchHostConfigKey = 'matchHost';
type MatchHostConfigValue = string;

export class MatchHostField<T extends EmptyConfig> extends StringNullableField<
  T,
  MatchHostConfigKey,
  MatchHostConfigValue
> {
  override name = 'matchHost' as const;

  override description =
    'A domain name, host name or base URL to match against.';
}

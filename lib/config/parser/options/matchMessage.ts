import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MatchMessageConfigKey = 'matchMessage';
type MatchMessageConfigValue = string;

export class MatchMessageField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  MatchMessageConfigKey,
  MatchMessageConfigValue
> {
  override name = 'matchMessage' as const;

  override description =
    'Regex/minimatch expression to match against log message.';
}

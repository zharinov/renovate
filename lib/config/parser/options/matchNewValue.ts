import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MatchNewValueConfigKey = 'matchNewValue';
type MatchNewValueConfigValue = string;

export class MatchNewValueField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  MatchNewValueConfigKey,
  MatchNewValueConfigValue
> {
  override name = 'matchNewValue' as const;

  override description =
    'A regex or glob pattern to match against the raw `newValue` string of a dependency. Valid only within a `packageRules` object.';
}

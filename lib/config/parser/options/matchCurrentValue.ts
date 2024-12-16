import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MatchCurrentValueConfigKey = 'matchCurrentValue';
type MatchCurrentValueConfigValue = string;

export class MatchCurrentValueField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  MatchCurrentValueConfigKey,
  MatchCurrentValueConfigValue
> {
  override name = 'matchCurrentValue' as const;

  override description =
    'A regex or glob pattern to match against the raw `currentValue` string of a dependency. Valid only within a `packageRules` object.';
}

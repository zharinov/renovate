import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MatchCurrentAgeConfigKey = 'matchCurrentAge';
type MatchCurrentAgeConfigValue = string;

export class MatchCurrentAgeField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  MatchCurrentAgeConfigKey,
  MatchCurrentAgeConfigValue
> {
  override name = 'matchCurrentAge' as const;

  override description =
    'Matches the current age of the package derived from its release timestamp. Valid only within a `packageRules` object.';
}

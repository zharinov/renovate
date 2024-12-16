import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MatchCurrentVersionConfigKey = 'matchCurrentVersion';
type MatchCurrentVersionConfigValue = string;

export class MatchCurrentVersionField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  MatchCurrentVersionConfigKey,
  MatchCurrentVersionConfigValue
> {
  override name = 'matchCurrentVersion' as const;

  override description =
    'A version, or range of versions, to match against the current version of a package. Valid only within a `packageRules` object.';
}

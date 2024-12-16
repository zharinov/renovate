import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ReplacementVersionConfigKey = 'replacementVersion';
type ReplacementVersionConfigValue = string;

export class ReplacementVersionField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  ReplacementVersionConfigKey,
  ReplacementVersionConfigValue
> {
  override name = 'replacementVersion' as const;

  override description =
    'The version of the new dependency that replaces the old deprecated dependency.';
}

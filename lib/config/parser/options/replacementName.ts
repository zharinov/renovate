import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ReplacementNameConfigKey = 'replacementName';
type ReplacementNameConfigValue = string;

export class ReplacementNameField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  ReplacementNameConfigKey,
  ReplacementNameConfigValue
> {
  override name = 'replacementName' as const;

  override description =
    'The name of the new dependency that replaces the old deprecated dependency.';
}

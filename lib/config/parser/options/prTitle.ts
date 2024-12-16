import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrTitleConfigKey = 'prTitle';
type PrTitleConfigValue = string;

export class PrTitleField<T extends EmptyConfig> extends StringNullableField<
  T,
  PrTitleConfigKey,
  PrTitleConfigValue
> {
  override name = 'prTitle' as const;

  override description =
    'Pull Request title template. Inherits from `commitMessage` if null.';
}

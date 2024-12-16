import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrBodyTemplateConfigKey = 'prBodyTemplate';
type PrBodyTemplateConfigValue = string;

export class PrBodyTemplateField<T extends EmptyConfig> extends StringField<
  T,
  PrBodyTemplateConfigKey,
  PrBodyTemplateConfigValue
> {
  override name = 'prBodyTemplate' as const;

  override description =
    'Pull Request body template. Controls which sections are rendered in the body of the pull request.';

  override defaultValue =
    '{{{header}}}{{{table}}}{{{warnings}}}{{{notes}}}{{{changelogs}}}{{{configDescription}}}{{{controls}}}{{{footer}}}' as const;
}

import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ReplacementNameTemplateConfigKey = 'replacementNameTemplate';
type ReplacementNameTemplateConfigValue = string;

export class ReplacementNameTemplateField<
  T extends EmptyConfig,
> extends StringField<
  T,
  ReplacementNameTemplateConfigKey,
  ReplacementNameTemplateConfigValue
> {
  override name = 'replacementNameTemplate' as const;

  override description = 'Controls what the replacement package name.';

  override defaultValue = '{{{packageName}}}' as const;
}

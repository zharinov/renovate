import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type AutoReplaceStringTemplateConfigKey = 'autoReplaceStringTemplate';
type AutoReplaceStringTemplateConfigValue = string;

export class AutoReplaceStringTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  AutoReplaceStringTemplateConfigKey,
  AutoReplaceStringTemplateConfigValue
> {
  override name = 'autoReplaceStringTemplate' as const;

  override description =
    'Optional `extractVersion` for extracted dependencies. Valid only within a `customManagers` object.';
}

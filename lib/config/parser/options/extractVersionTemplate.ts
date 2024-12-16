import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ExtractVersionTemplateConfigKey = 'extractVersionTemplate';
type ExtractVersionTemplateConfigValue = string;

export class ExtractVersionTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  ExtractVersionTemplateConfigKey,
  ExtractVersionTemplateConfigValue
> {
  override name = 'extractVersionTemplate' as const;

  override description =
    'Optional `extractVersion` for extracted dependencies. Valid only within a `customManagers` object.';
}

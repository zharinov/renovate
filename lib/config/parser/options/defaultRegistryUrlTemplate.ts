import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type DefaultRegistryUrlTemplateConfigKey = 'defaultRegistryUrlTemplate';
type DefaultRegistryUrlTemplateConfigValue = string;

export class DefaultRegistryUrlTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  DefaultRegistryUrlTemplateConfigKey,
  DefaultRegistryUrlTemplateConfigValue
> {
  override name = 'defaultRegistryUrlTemplate' as const;

  override description =
    'Template for generating a `defaultRegistryUrl` for custom datasource.';
}

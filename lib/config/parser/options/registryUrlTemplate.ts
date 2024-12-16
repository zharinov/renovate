import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type RegistryUrlTemplateConfigKey = 'registryUrlTemplate';
type RegistryUrlTemplateConfigValue = string;

export class RegistryUrlTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  RegistryUrlTemplateConfigKey,
  RegistryUrlTemplateConfigValue
> {
  override name = 'registryUrlTemplate' as const;

  override description =
    'Optional registry URL for extracted dependencies. Valid only within a `customManagers` object.';
}

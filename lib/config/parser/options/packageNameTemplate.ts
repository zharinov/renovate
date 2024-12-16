import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PackageNameTemplateConfigKey = 'packageNameTemplate';
type PackageNameTemplateConfigValue = string;

export class PackageNameTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  PackageNameTemplateConfigKey,
  PackageNameTemplateConfigValue
> {
  override name = 'packageNameTemplate' as const;

  override description =
    'Optional packageName for extracted dependencies, else defaults to `depName` value. Valid only within a `customManagers` object.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type VersioningTemplateConfigKey = 'versioningTemplate';
type VersioningTemplateConfigValue = string;

export class VersioningTemplateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  VersioningTemplateConfigKey,
  VersioningTemplateConfigValue
> {
  override name = 'versioningTemplate' as const;

  override description =
    'Optional versioning for extracted dependencies. Valid only within a `customManagers` object.';
}

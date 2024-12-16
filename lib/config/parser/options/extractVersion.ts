import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ExtractVersionConfigKey = 'extractVersion';
type ExtractVersionConfigValue = string;

export class ExtractVersionField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  ExtractVersionConfigKey,
  ExtractVersionConfigValue
> {
  override name = 'extractVersion' as const;

  override description =
    "A regex (`re2`) to extract a version from a datasource's raw version string.";
}

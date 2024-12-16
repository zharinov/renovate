import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type SourceUrlConfigKey = 'sourceUrl';
type SourceUrlConfigValue = string;

export class SourceUrlField<T extends EmptyConfig> extends StringNullableField<
  T,
  SourceUrlConfigKey,
  SourceUrlConfigValue
> {
  override name = 'sourceUrl' as const;

  override description = 'The source URL of the package.';
}

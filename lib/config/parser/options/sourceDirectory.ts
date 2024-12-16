import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type SourceDirectoryConfigKey = 'sourceDirectory';
type SourceDirectoryConfigValue = string;

export class SourceDirectoryField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  SourceDirectoryConfigKey,
  SourceDirectoryConfigValue
> {
  override name = 'sourceDirectory' as const;

  override description =
    'The source directory in which the package is present at its source.';
}

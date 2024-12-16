import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type NpmrcConfigKey = 'npmrc';
type NpmrcConfigValue = string;

export class NpmrcField<T extends EmptyConfig> extends StringNullableField<
  T,
  NpmrcConfigKey,
  NpmrcConfigValue
> {
  override name = 'npmrc' as const;

  override description =
    'String copy of `.npmrc` file. Use `\\n` instead of line breaks.';
}

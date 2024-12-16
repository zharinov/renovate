import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type NpmTokenConfigKey = 'npmToken';
type NpmTokenConfigValue = string;

export class NpmTokenField<T extends EmptyConfig> extends StringNullableField<
  T,
  NpmTokenConfigKey,
  NpmTokenConfigValue
> {
  override name = 'npmToken' as const;

  override description =
    'npm token used to authenticate with the default registry.';
}

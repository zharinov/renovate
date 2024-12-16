import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrivateKeyConfigKey = 'privateKey';
type PrivateKeyConfigValue = string;

export class PrivateKeyField<T extends EmptyConfig> extends StringNullableField<
  T,
  PrivateKeyConfigKey,
  PrivateKeyConfigValue
> {
  override name = 'privateKey' as const;

  override description = 'Server-side private key.';
}

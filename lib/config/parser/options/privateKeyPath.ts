import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrivateKeyPathConfigKey = 'privateKeyPath';
type PrivateKeyPathConfigValue = string;

export class PrivateKeyPathField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  PrivateKeyPathConfigKey,
  PrivateKeyPathConfigValue
> {
  override name = 'privateKeyPath' as const;

  override description = 'Path to the Server-side private key.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrivateKeyPathOldConfigKey = 'privateKeyPathOld';
type PrivateKeyPathOldConfigValue = string;

export class PrivateKeyPathOldField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  PrivateKeyPathOldConfigKey,
  PrivateKeyPathOldConfigValue
> {
  override name = 'privateKeyPathOld' as const;

  override description = 'Path to the Server-side old private key.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrivateKeyOldConfigKey = 'privateKeyOld';
type PrivateKeyOldConfigValue = string;

export class PrivateKeyOldField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  PrivateKeyOldConfigKey,
  PrivateKeyOldConfigValue
> {
  override name = 'privateKeyOld' as const;

  override description = 'Secondary or old private key to try.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type HttpsPrivateKeyConfigKey = 'httpsPrivateKey';
type HttpsPrivateKeyConfigValue = string;

export class HttpsPrivateKeyField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  HttpsPrivateKeyConfigKey,
  HttpsPrivateKeyConfigValue
> {
  override name = 'httpsPrivateKey' as const;

  override description = 'The private key in PEM format.';
}

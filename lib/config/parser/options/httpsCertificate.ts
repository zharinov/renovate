import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type HttpsCertificateConfigKey = 'httpsCertificate';
type HttpsCertificateConfigValue = string;

export class HttpsCertificateField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  HttpsCertificateConfigKey,
  HttpsCertificateConfigValue
> {
  override name = 'httpsCertificate' as const;

  override description = 'The certificate chains in PEM format.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type HttpsCertificateAuthorityConfigKey = 'httpsCertificateAuthority';
type HttpsCertificateAuthorityConfigValue = string;

export class HttpsCertificateAuthorityField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  HttpsCertificateAuthorityConfigKey,
  HttpsCertificateAuthorityConfigValue
> {
  override name = 'httpsCertificateAuthority' as const;

  override description = 'The overriding trusted CA certificate.';
}

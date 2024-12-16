import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type S3EndpointConfigKey = 's3Endpoint';
type S3EndpointConfigValue = string;

export class S3EndpointField<T extends EmptyConfig> extends StringNullableField<
  T,
  S3EndpointConfigKey,
  S3EndpointConfigValue
> {
  override name = 's3Endpoint' as const;

  override description =
    'If set, Renovate will use this string as the `endpoint` when creating the AWS S3 client instance.';
}

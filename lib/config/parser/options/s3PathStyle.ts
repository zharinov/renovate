import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class S3PathStyleField<T extends EmptyConfig> extends BooleanField<
  T,
  's3PathStyle'
> {
  override name = 's3PathStyle' as const;

  override description =
    'If set, Renovate will enable `forcePathStyle` when creating the AWS S3 client instance.';

  override defaultValue = false;
}

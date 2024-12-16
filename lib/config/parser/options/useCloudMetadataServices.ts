import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class UseCloudMetadataServicesField<
  T extends EmptyConfig,
> extends BooleanField<T, 'useCloudMetadataServices'> {
  override name = 'useCloudMetadataServices' as const;

  override description =
    'If `false`, Renovate does not try to access cloud metadata services.';

  override defaultValue = true;
}

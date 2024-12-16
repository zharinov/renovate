import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DeleteConfigFileField<T extends EmptyConfig> extends BooleanField<
  T,
  'deleteConfigFile'
> {
  override name = 'deleteConfigFile' as const;

  override description =
    'If set to `true`, Renovate tries to delete the self-hosted config file after reading it.';

  override defaultValue = false;
}

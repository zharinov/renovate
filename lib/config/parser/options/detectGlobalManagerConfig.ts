import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DetectGlobalManagerConfigField<
  T extends EmptyConfig,
> extends BooleanField<T, 'detectGlobalManagerConfig'> {
  override name = 'detectGlobalManagerConfig' as const;

  override description =
    'If `true`, Renovate tries to detect global manager configuration from the file system.';

  override defaultValue = false;
}

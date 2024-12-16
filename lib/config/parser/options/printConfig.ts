import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PrintConfigField<T extends EmptyConfig> extends BooleanField<
  T,
  'printConfig'
> {
  override name = 'printConfig' as const;

  override description =
    'If enabled, Renovate logs the fully resolved config for each repository, plus the fully resolved presets.';

  override defaultValue = false;
}

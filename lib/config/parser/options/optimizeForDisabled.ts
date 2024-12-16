import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class OptimizeForDisabledField<
  T extends EmptyConfig,
> extends BooleanField<T, 'optimizeForDisabled'> {
  override name = 'optimizeForDisabled' as const;

  override description =
    'Set to `true` to perform a check for disabled config prior to cloning.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class CloneSubmodulesField<T extends EmptyConfig> extends BooleanField<
  T,
  'cloneSubmodules'
> {
  override name = 'cloneSubmodules' as const;

  override description =
    'Set to `true` to initialize submodules during repository clone.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class SeparateMinorPatchField<
  T extends EmptyConfig,
> extends BooleanField<T, 'separateMinorPatch'> {
  override name = 'separateMinorPatch' as const;

  override description =
    'If set to `true`, Renovate will separate `minor` and `patch` updates into separate branches.';

  override defaultValue = false;
}

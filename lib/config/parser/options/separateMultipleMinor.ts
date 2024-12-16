import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class SeparateMultipleMinorField<
  T extends EmptyConfig,
> extends BooleanField<T, 'separateMultipleMinor'> {
  override name = 'separateMultipleMinor' as const;

  override description =
    'If set to `true`, Renovate creates separate PRs for each `minor` stream.';

  override defaultValue = false;
}

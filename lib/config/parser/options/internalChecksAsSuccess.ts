import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class InternalChecksAsSuccessField<
  T extends EmptyConfig,
> extends BooleanField<T, 'internalChecksAsSuccess'> {
  override name = 'internalChecksAsSuccess' as const;

  override description =
    'Whether to consider passing internal checks such as `minimumReleaseAge` when determining branch status.';

  override defaultValue = false;
}

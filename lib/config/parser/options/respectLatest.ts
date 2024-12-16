import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class RespectLatestField<T extends EmptyConfig> extends BooleanField<
  T,
  'respectLatest'
> {
  override name = 'respectLatest' as const;

  override description = 'Ignore versions newer than npm "latest" version.';

  override defaultValue = true;
}

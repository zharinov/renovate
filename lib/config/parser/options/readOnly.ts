import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ReadOnlyField<T extends EmptyConfig> extends BooleanField<
  T,
  'readOnly'
> {
  override name = 'readOnly' as const;

  override description =
    'Match against requests that only read data and do not mutate anything.';

  override defaultValue = false;
}

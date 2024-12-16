import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AbortOnErrorField<T extends EmptyConfig> extends BooleanField<
  T,
  'abortOnError'
> {
  override name = 'abortOnError' as const;

  override description =
    'If enabled, Renovate aborts its run when HTTP request errors occur.';

  override defaultValue = false;
}

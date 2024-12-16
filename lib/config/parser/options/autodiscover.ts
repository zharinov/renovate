import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AutodiscoverField<T extends EmptyConfig> extends BooleanField<
  T,
  'autodiscover'
> {
  override name = 'autodiscover' as const;

  override description = 'Autodiscover all repositories.';

  override defaultValue = false;
}

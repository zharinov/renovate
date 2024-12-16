import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DnsCacheField<T extends EmptyConfig> extends BooleanField<
  T,
  'dnsCache'
> {
  override name = 'dnsCache' as const;

  override description = 'Enable got DNS cache.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class KeepAliveField<T extends EmptyConfig> extends BooleanField<
  T,
  'keepAlive'
> {
  override name = 'keepAlive' as const;

  override description = 'Enable HTTP keep-alive for hosts.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class EnableHttp2Field<T extends EmptyConfig> extends BooleanField<
  T,
  'enableHttp2'
> {
  override name = 'enableHttp2' as const;

  override description = 'Enable got HTTP/2 support.';

  override defaultValue = false;
}

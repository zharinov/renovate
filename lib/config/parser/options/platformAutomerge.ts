import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PlatformAutomergeField<T extends EmptyConfig> extends BooleanField<
  T,
  'platformAutomerge'
> {
  override name = 'platformAutomerge' as const;

  override description = 'Controls if platform-native auto-merge is used.';

  override defaultValue = true;
}

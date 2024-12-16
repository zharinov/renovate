import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IgnoreTestsField<T extends EmptyConfig> extends BooleanField<
  T,
  'ignoreTests'
> {
  override name = 'ignoreTests' as const;

  override description = 'Set to `true` to enable automerging without tests.';

  override defaultValue = false;
}

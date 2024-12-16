import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class InheritConfigStrictField<
  T extends EmptyConfig,
> extends BooleanField<T, 'inheritConfigStrict'> {
  override name = 'inheritConfigStrict' as const;

  override description =
    'If `true`, any `inheritedConfig` fetch error will result in an aborted run.';

  override defaultValue = false;
}

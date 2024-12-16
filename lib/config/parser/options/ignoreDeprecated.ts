import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IgnoreDeprecatedField<T extends EmptyConfig> extends BooleanField<
  T,
  'ignoreDeprecated'
> {
  override name = 'ignoreDeprecated' as const;

  override description =
    'Avoid upgrading from a non-deprecated version to a deprecated one.';

  override defaultValue = true;
}

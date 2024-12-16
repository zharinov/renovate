import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ForceCliField<T extends EmptyConfig> extends BooleanField<
  T,
  'forceCli'
> {
  override name = 'forceCli' as const;

  override description =
    'Decides if CLI configuration options are moved to the `force` config section.';

  override defaultValue = true;
}

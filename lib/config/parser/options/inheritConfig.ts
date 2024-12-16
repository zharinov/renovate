import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class InheritConfigField<T extends EmptyConfig> extends BooleanField<
  T,
  'inheritConfig'
> {
  override name = 'inheritConfig' as const;

  override description =
    'If `true`, Renovate will inherit configuration from the `inheritConfigFileName` file in `inheritConfigRepoName`.';

  override defaultValue = false;
}

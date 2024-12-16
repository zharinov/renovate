import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ForkCreationField<T extends EmptyConfig> extends BooleanField<
  T,
  'forkCreation'
> {
  override name = 'forkCreation' as const;

  override description =
    'Whether to create forks as needed at runtime when running in "fork mode".';

  override defaultValue = true;
}

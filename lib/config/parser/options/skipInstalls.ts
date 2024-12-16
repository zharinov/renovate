import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class SkipInstallsField<T extends EmptyConfig> extends BooleanField<
  T,
  'skipInstalls'
> {
  override name = 'skipInstalls' as const;

  override description =
    'Skip installing modules/dependencies if lock file updating is possible without a full install.';

  override defaultValue = false;
}

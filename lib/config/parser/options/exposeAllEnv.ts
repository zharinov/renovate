import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ExposeAllEnvField<T extends EmptyConfig> extends BooleanField<
  T,
  'exposeAllEnv'
> {
  override name = 'exposeAllEnv' as const;

  override description =
    'Set this to `true` to allow passing of all environment variables to package managers.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AllowCustomCrateRegistriesField<
  T extends EmptyConfig,
> extends BooleanField<T, 'allowCustomCrateRegistries'> {
  override name = 'allowCustomCrateRegistries' as const;

  override description = 'Set this to `true` to allow custom crate registries.';

  override defaultValue = false;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class InsecureRegistryField<T extends EmptyConfig> extends BooleanField<
  T,
  'insecureRegistry'
> {
  override name = 'insecureRegistry' as const;

  override description =
    'Explicitly turn on insecure Docker registry access (HTTP).';

  override defaultValue = false;
}

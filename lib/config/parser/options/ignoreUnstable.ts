import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IgnoreUnstableField<T extends EmptyConfig> extends BooleanField<
  T,
  'ignoreUnstable'
> {
  override name = 'ignoreUnstable' as const;

  override description = 'Ignore versions with unstable SemVer.';

  override defaultValue = true;
}

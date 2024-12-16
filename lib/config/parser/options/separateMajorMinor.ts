import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class SeparateMajorMinorField<
  T extends EmptyConfig,
> extends BooleanField<T, 'separateMajorMinor'> {
  override name = 'separateMajorMinor' as const;

  override description =
    'If set to `false`, Renovate will upgrade dependencies to their latest release only. Renovate will not separate major or minor branches.';

  override defaultValue = true;
}

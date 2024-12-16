import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class SeparateMultipleMajorField<
  T extends EmptyConfig,
> extends BooleanField<T, 'separateMultipleMajor'> {
  override name = 'separateMultipleMajor' as const;

  override description =
    'If set to `true`, PRs will be raised separately for each available `major` upgrade version.';

  override defaultValue = false;
}

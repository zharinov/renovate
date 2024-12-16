import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class NpmrcMergeField<T extends EmptyConfig> extends BooleanField<
  T,
  'npmrcMerge'
> {
  override name = 'npmrcMerge' as const;

  override description =
    'Whether to merge `config.npmrc` with repo `.npmrc` content if both are found.';

  override defaultValue = false;
}

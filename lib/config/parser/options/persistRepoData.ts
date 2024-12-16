import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PersistRepoDataField<T extends EmptyConfig> extends BooleanField<
  T,
  'persistRepoData'
> {
  override name = 'persistRepoData' as const;

  override description =
    'If set to `true`: keep repository data between runs instead of deleting the data.';

  override defaultValue = false;
}

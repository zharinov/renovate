import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class UpdateLockFilesField<T extends EmptyConfig> extends BooleanField<
  T,
  'updateLockFiles'
> {
  override name = 'updateLockFiles' as const;

  override description = 'Set to `false` to disable lock file updating.';

  override defaultValue = true;
}

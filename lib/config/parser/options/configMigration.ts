import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ConfigMigrationField<T extends EmptyConfig> extends BooleanField<
  T,
  'configMigration'
> {
  override name = 'configMigration' as const;

  override description = 'Enable this to get config migration PRs when needed.';

  override defaultValue = false;
}

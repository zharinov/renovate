import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AllowPluginsField<T extends EmptyConfig> extends BooleanField<
  T,
  'allowPlugins'
> {
  override name = 'allowPlugins' as const;

  override description =
    'Set this to `true` if repositories are allowed to run install plugins.';

  override defaultValue = false;
}

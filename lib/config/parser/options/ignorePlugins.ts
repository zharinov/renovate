import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IgnorePluginsField<T extends EmptyConfig> extends BooleanField<
  T,
  'ignorePlugins'
> {
  override name = 'ignorePlugins' as const;

  override description =
    'Set this to `true` if `allowPlugins=true` but you wish to skip running plugins when updating lock files.';

  override defaultValue = false;
}

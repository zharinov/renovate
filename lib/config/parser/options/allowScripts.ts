import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AllowScriptsField<T extends EmptyConfig> extends BooleanField<
  T,
  'allowScripts'
> {
  override name = 'allowScripts' as const;

  override description =
    'Set this to `true` if repositories are allowed to run install scripts.';

  override defaultValue = false;
}

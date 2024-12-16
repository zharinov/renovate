import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IgnoreScriptsField<T extends EmptyConfig> extends BooleanField<
  T,
  'ignoreScripts'
> {
  override name = 'ignoreScripts' as const;

  override description =
    'Set this to `false` if `allowScripts=true` and you wish to run scripts when updating lock files.';

  override defaultValue = true;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AutoReplaceGlobalMatchField<
  T extends EmptyConfig,
> extends BooleanField<T, 'autoReplaceGlobalMatch'> {
  override name = 'autoReplaceGlobalMatch' as const;

  override description =
    'Control whether replacement regular expressions are global matches or only the first match.';

  override defaultValue = true;
}

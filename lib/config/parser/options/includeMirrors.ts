import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IncludeMirrorsField<T extends EmptyConfig> extends BooleanField<
  T,
  'includeMirrors'
> {
  override name = 'includeMirrors' as const;

  override description =
    'Whether to process repositories that are mirrors. By default, repositories that are mirrors are skipped.';

  override defaultValue = false;
}

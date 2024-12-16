import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class CommitBodyTableField<T extends EmptyConfig> extends BooleanField<
  T,
  'commitBodyTable'
> {
  override name = 'commitBodyTable' as const;

  override description =
    'If enabled, append a table in the commit message body describing all updates in the commit.';

  override defaultValue = false;
}

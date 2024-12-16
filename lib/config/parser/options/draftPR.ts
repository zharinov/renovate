import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DraftPRField<T extends EmptyConfig> extends BooleanField<
  T,
  'draftPR'
> {
  override name = 'draftPR' as const;

  override description =
    'If set to `true` then Renovate creates draft PRs, instead of normal status PRs.';

  override defaultValue = false;
}

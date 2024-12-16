import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ReviewersFromCodeOwnersField<
  T extends EmptyConfig,
> extends BooleanField<T, 'reviewersFromCodeOwners'> {
  override name = 'reviewersFromCodeOwners' as const;

  override description =
    'Determine reviewers based on configured code owners and changes in PR.';

  override defaultValue = false;
}

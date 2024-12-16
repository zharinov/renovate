import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class FilterUnavailableUsersField<
  T extends EmptyConfig,
> extends BooleanField<T, 'filterUnavailableUsers'> {
  override name = 'filterUnavailableUsers' as const;

  override description =
    'Filter reviewers and assignees based on their availability.';

  override defaultValue = false;
}

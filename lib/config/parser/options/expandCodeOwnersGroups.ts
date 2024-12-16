import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ExpandCodeOwnersGroupsField<
  T extends EmptyConfig,
> extends BooleanField<T, 'expandCodeOwnersGroups'> {
  override name = 'expandCodeOwnersGroups' as const;

  override description =
    'Expand the configured code owner groups into a full list of group members.';

  override defaultValue = false;
}

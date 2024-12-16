import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class AssigneesFromCodeOwnersField<
  T extends EmptyConfig,
> extends BooleanField<T, 'assigneesFromCodeOwners'> {
  override name = 'assigneesFromCodeOwners' as const;

  override description =
    'Determine assignees based on configured code owners and changes in PR.';

  override defaultValue = false;
}

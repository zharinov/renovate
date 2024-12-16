import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class BbAutoResolvePrTasksField<
  T extends EmptyConfig,
> extends BooleanField<T, 'bbAutoResolvePrTasks'> {
  override name = 'bbAutoResolvePrTasks' as const;

  override description =
    'The PR tasks will be automatically completed after the PR is raised.';

  override defaultValue = false;
}

import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type AzureWorkItemIdConfigKey = 'azureWorkItemId';
type AzureWorkItemIdConfigValue = number;

export class AzureWorkItemIdField<T extends EmptyConfig> extends IntegerField<
  T,
  AzureWorkItemIdConfigKey,
  AzureWorkItemIdConfigValue
> {
  override name = 'azureWorkItemId' as const;

  override description =
    'The id of an existing work item on Azure Boards to link to each PR.';

  override defaultValue = 0;
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type GroupNameConfigKey = 'groupName';
type GroupNameConfigValue = string;

export class GroupNameField<T extends EmptyConfig> extends StringNullableField<
  T,
  GroupNameConfigKey,
  GroupNameConfigValue
> {
  override name = 'groupName' as const;

  override description = 'Human understandable name for the dependency group.';
}

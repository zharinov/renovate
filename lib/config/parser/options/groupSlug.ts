import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type GroupSlugConfigKey = 'groupSlug';
type GroupSlugConfigValue = string;

export class GroupSlugField<T extends EmptyConfig> extends StringNullableField<
  T,
  GroupSlugConfigKey,
  GroupSlugConfigValue
> {
  override name = 'groupSlug' as const;

  override description =
    'Slug to use for group (e.g. in branch name). Slug is calculated from `groupName` if `null`.';
}

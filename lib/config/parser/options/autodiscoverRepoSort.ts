import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type AutodiscoverRepoSortConfigKey = 'autodiscoverRepoSort';
type AutodiscoverRepoSortConfigValue = string;

export class AutodiscoverRepoSortField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  AutodiscoverRepoSortConfigKey,
  AutodiscoverRepoSortConfigValue
> {
  override name = 'autodiscoverRepoSort' as const;

  override description =
    'The sort method for autodiscover server side repository search.';

  override allowedValues = ['alpha', 'created', 'updated', 'size', 'id'];
}

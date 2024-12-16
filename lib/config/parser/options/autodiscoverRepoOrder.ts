import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type AutodiscoverRepoOrderConfigKey = 'autodiscoverRepoOrder';
type AutodiscoverRepoOrderConfigValue = string;

export class AutodiscoverRepoOrderField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  AutodiscoverRepoOrderConfigKey,
  AutodiscoverRepoOrderConfigValue
> {
  override name = 'autodiscoverRepoOrder' as const;

  override description =
    'The order method for autodiscover server side repository search.';

  override allowedValues = ['asc', 'desc'];
}

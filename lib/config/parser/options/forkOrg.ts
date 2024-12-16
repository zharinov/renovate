import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ForkOrgConfigKey = 'forkOrg';
type ForkOrgConfigValue = string;

export class ForkOrgField<T extends EmptyConfig> extends StringNullableField<
  T,
  ForkOrgConfigKey,
  ForkOrgConfigValue
> {
  override name = 'forkOrg' as const;

  override description =
    'The preferred organization to create or find forked repositories, when in fork mode.';
}

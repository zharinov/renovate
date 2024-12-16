import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ForkTokenConfigKey = 'forkToken';
type ForkTokenConfigValue = string;

export class ForkTokenField<T extends EmptyConfig> extends StringNullableField<
  T,
  ForkTokenConfigKey,
  ForkTokenConfigValue
> {
  override name = 'forkToken' as const;

  override description =
    'Set a personal access token here to enable "fork mode".';
}

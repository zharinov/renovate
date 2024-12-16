import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type GitTimeoutConfigKey = 'gitTimeout';
type GitTimeoutConfigValue = number;

export class GitTimeoutField<T extends EmptyConfig> extends IntegerField<
  T,
  GitTimeoutConfigKey,
  GitTimeoutConfigValue
> {
  override name = 'gitTimeout' as const;

  override description =
    'Configure the timeout with a number of milliseconds to wait for a Git task.';

  override defaultValue = 0;
}

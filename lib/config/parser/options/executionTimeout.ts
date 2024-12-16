import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type ExecutionTimeoutConfigKey = 'executionTimeout';
type ExecutionTimeoutConfigValue = number;

export class ExecutionTimeoutField<T extends EmptyConfig> extends IntegerField<
  T,
  ExecutionTimeoutConfigKey,
  ExecutionTimeoutConfigValue
> {
  override name = 'executionTimeout' as const;

  override description =
    'Default execution timeout in minutes for child processes Renovate creates.';

  override defaultValue = 15;
}

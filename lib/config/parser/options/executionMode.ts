import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const executionModeValues = ['update', 'branch'] as const;

type ExecutionModeConfigKey = 'executionMode';
type ExecutionModeConfigValue = (typeof executionModeValues)[number];

export class ExecutionModeField<T extends EmptyConfig> extends StringField<
  T,
  ExecutionModeConfigKey,
  ExecutionModeConfigValue
> {
  override name = 'executionMode' as const;

  override description =
    'Controls when the post upgrade tasks run: on every update, or once per upgrade branch.';

  override defaultValue = 'update' as const;

  override allowedValues = [...executionModeValues];
}

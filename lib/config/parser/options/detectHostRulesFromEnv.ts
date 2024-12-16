import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class DetectHostRulesFromEnvField<
  T extends EmptyConfig,
> extends BooleanField<T, 'detectHostRulesFromEnv'> {
  override name = 'detectHostRulesFromEnv' as const;

  override description =
    'If `true`, Renovate tries to detect host rules from environment variables.';

  override defaultValue = false;
}

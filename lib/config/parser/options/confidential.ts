import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class ConfidentialField<T extends EmptyConfig> extends BooleanField<
  T,
  'confidential'
> {
  override name = 'confidential' as const;

  override description =
    'If enabled, issues created by Renovate are set as confidential.';

  override defaultValue = false;
}

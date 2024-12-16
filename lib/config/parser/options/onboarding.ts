import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class OnboardingField<T extends EmptyConfig> extends BooleanField<
  T,
  'onboarding'
> {
  override name = 'onboarding' as const;

  override description = 'Require a Configuration PR first.';

  override defaultValue = true;
}

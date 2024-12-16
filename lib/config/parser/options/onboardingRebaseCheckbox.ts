import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class OnboardingRebaseCheckboxField<
  T extends EmptyConfig,
> extends BooleanField<T, 'onboardingRebaseCheckbox'> {
  override name = 'onboardingRebaseCheckbox' as const;

  override description =
    'Set to enable rebase/retry markdown checkbox for onboarding PRs.';

  override defaultValue = false;
}

import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OnboardingBranchConfigKey = 'onboardingBranch';
type OnboardingBranchConfigValue = string;

export class OnboardingBranchField<T extends EmptyConfig> extends StringField<
  T,
  OnboardingBranchConfigKey,
  OnboardingBranchConfigValue
> {
  override name = 'onboardingBranch' as const;

  override description =
    'Change this value to override the default onboarding branch name.';

  override defaultValue = 'renovate/configure' as const;
}

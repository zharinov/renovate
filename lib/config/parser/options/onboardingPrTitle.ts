import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OnboardingPrTitleConfigKey = 'onboardingPrTitle';
type OnboardingPrTitleConfigValue = string;

export class OnboardingPrTitleField<T extends EmptyConfig> extends StringField<
  T,
  OnboardingPrTitleConfigKey,
  OnboardingPrTitleConfigValue
> {
  override name = 'onboardingPrTitle' as const;

  override description =
    'Change this value to override the default onboarding PR title.';

  override defaultValue = 'Configure Renovate' as const;
}

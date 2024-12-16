import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OnboardingConfigFileNameConfigKey = 'onboardingConfigFileName';
type OnboardingConfigFileNameConfigValue = string;

export class OnboardingConfigFileNameField<
  T extends EmptyConfig,
> extends StringField<
  T,
  OnboardingConfigFileNameConfigKey,
  OnboardingConfigFileNameConfigValue
> {
  override name = 'onboardingConfigFileName' as const;

  override description =
    'Change this value to override the default onboarding config file name.';

  override defaultValue = 'renovate.json' as const;
}

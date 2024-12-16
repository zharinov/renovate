import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const onboardingNoDepsValues = ['auto', 'enabled', 'disabled'] as const;

type OnboardingNoDepsConfigKey = 'onboardingNoDeps';
type OnboardingNoDepsConfigValue = (typeof onboardingNoDepsValues)[number];

export class OnboardingNoDepsField<T extends EmptyConfig> extends StringField<
  T,
  OnboardingNoDepsConfigKey,
  OnboardingNoDepsConfigValue
> {
  override name = 'onboardingNoDeps' as const;

  override description =
    'Onboard the repository even if no dependencies are found.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...onboardingNoDepsValues];
}

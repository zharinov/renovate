import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type OnboardingCommitMessageConfigKey = 'onboardingCommitMessage';
type OnboardingCommitMessageConfigValue = string;

export class OnboardingCommitMessageField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  OnboardingCommitMessageConfigKey,
  OnboardingCommitMessageConfigValue
> {
  override name = 'onboardingCommitMessage' as const;

  override description =
    'Change this value to override the default onboarding commit message.';
}

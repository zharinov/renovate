import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MinimumReleaseAgeConfigKey = 'minimumReleaseAge';
type MinimumReleaseAgeConfigValue = string;

export class MinimumReleaseAgeField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  MinimumReleaseAgeConfigKey,
  MinimumReleaseAgeConfigValue
> {
  override name = 'minimumReleaseAge' as const;

  override description =
    'Time required before a new release is considered stable.';
}

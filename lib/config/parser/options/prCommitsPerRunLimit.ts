import { IntegerField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type PrCommitsPerRunLimitConfigKey = 'prCommitsPerRunLimit';
type PrCommitsPerRunLimitConfigValue = number;

export class PrCommitsPerRunLimitField<
  T extends EmptyConfig,
> extends IntegerField<
  T,
  PrCommitsPerRunLimitConfigKey,
  PrCommitsPerRunLimitConfigValue
> {
  override name = 'prCommitsPerRunLimit' as const;

  override description =
    'Set the maximum number of commits per Renovate run. By default there is no limit.';

  override defaultValue = 0;
}

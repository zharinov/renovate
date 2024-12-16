import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const useBaseBranchConfigValues = ['merge', 'none'] as const;

type UseBaseBranchConfigConfigKey = 'useBaseBranchConfig';
type UseBaseBranchConfigConfigValue =
  (typeof useBaseBranchConfigValues)[number];

export class UseBaseBranchConfigField<
  T extends EmptyConfig,
> extends StringField<
  T,
  UseBaseBranchConfigConfigKey,
  UseBaseBranchConfigConfigValue
> {
  override name = 'useBaseBranchConfig' as const;

  override description =
    'Whether to read configuration from `baseBranches` instead of only the default branch.';

  override defaultValue = 'none' as const;

  override allowedValues = [...useBaseBranchConfigValues];
}

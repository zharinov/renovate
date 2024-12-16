import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const dryRunValues = ['extract', 'lookup', 'full'] as const;

type DryRunConfigKey = 'dryRun';
type DryRunConfigValue = (typeof dryRunValues)[number];

export class DryRunField<T extends EmptyConfig> extends StringNullableField<
  T,
  DryRunConfigKey,
  DryRunConfigValue
> {
  override name = 'dryRun' as const;

  override description =
    'If enabled, perform a dry run by logging messages instead of creating/updating/deleting branches and PRs.';

  override allowedValues = [...dryRunValues];
}

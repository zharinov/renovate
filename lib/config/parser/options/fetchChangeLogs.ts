import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const fetchChangeLogsValues = ['off', 'branch', 'pr'] as const;

type FetchChangeLogsConfigKey = 'fetchChangeLogs';
type FetchChangeLogsConfigValue = (typeof fetchChangeLogsValues)[number];

export class FetchChangeLogsField<T extends EmptyConfig> extends StringField<
  T,
  FetchChangeLogsConfigKey,
  FetchChangeLogsConfigValue
> {
  override name = 'fetchChangeLogs' as const;

  override description =
    'Controls if and when changelogs/release notes are fetched.';

  override defaultValue = 'pr' as const;

  override allowedValues = [...fetchChangeLogsValues];
}

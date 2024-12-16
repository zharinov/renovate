import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ChangelogUrlConfigKey = 'changelogUrl';
type ChangelogUrlConfigValue = string;

export class ChangelogUrlField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  ChangelogUrlConfigKey,
  ChangelogUrlConfigValue
> {
  override name = 'changelogUrl' as const;

  override description =
    'Set a custom URL for the changelog. Renovate will put this URL in the PR body text.';
}

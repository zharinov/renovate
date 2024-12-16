import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type WriteDiscoveredReposConfigKey = 'writeDiscoveredRepos';
type WriteDiscoveredReposConfigValue = string;

export class WriteDiscoveredReposField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  WriteDiscoveredReposConfigKey,
  WriteDiscoveredReposConfigValue
> {
  override name = 'writeDiscoveredRepos' as const;

  override description =
    'Writes discovered repositories to a JSON file and then exit.';
}

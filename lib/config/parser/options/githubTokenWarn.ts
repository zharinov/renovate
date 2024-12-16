import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class GithubTokenWarnField<T extends EmptyConfig> extends BooleanField<
  T,
  'githubTokenWarn'
> {
  override name = 'githubTokenWarn' as const;

  override description = 'Display warnings about GitHub token not being set.';

  override defaultValue = true;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class IgnorePrAuthorField<T extends EmptyConfig> extends BooleanField<
  T,
  'ignorePrAuthor'
> {
  override name = 'ignorePrAuthor' as const;

  override description =
    'Set to `true` to fetch the entire list of PRs instead of only those authored by the Renovate user.';

  override defaultValue = false;
}

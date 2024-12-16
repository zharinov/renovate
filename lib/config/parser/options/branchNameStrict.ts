import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class BranchNameStrictField<T extends EmptyConfig> extends BooleanField<
  T,
  'branchNameStrict'
> {
  override name = 'branchNameStrict' as const;

  override description =
    'Whether to be strict about the use of special characters within the branch name.';

  override defaultValue = false;
}

import { IntegerNullableField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type HashedBranchLengthConfigKey = 'hashedBranchLength';
type HashedBranchLengthConfigValue = number;

export class HashedBranchLengthField<
  T extends EmptyConfig,
> extends IntegerNullableField<
  T,
  HashedBranchLengthConfigKey,
  HashedBranchLengthConfigValue
> {
  override name = 'hashedBranchLength' as const;

  override description =
    'If enabled, branch names will use a hashing function to ensure each branch has that length.';
}

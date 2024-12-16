import { IntegerNullableField } from '../base/integer-field';
import type { EmptyConfig } from '../base/types';

type ReviewersSampleSizeConfigKey = 'reviewersSampleSize';
type ReviewersSampleSizeConfigValue = number;

export class ReviewersSampleSizeField<
  T extends EmptyConfig,
> extends IntegerNullableField<
  T,
  ReviewersSampleSizeConfigKey,
  ReviewersSampleSizeConfigValue
> {
  override name = 'reviewersSampleSize' as const;

  override description = 'Take a random sample of given size from `reviewers`.';
}

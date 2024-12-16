import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class BbUseDefaultReviewersField<
  T extends EmptyConfig,
> extends BooleanField<T, 'bbUseDefaultReviewers'> {
  override name = 'bbUseDefaultReviewers' as const;

  override description = 'Use the default reviewers (Bitbucket only).';

  override defaultValue = true;
}

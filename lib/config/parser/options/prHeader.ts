import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type PrHeaderConfigKey = 'prHeader';
type PrHeaderConfigValue = string;

export class PrHeaderField<T extends EmptyConfig> extends StringNullableField<
  T,
  PrHeaderConfigKey,
  PrHeaderConfigValue
> {
  override name = 'prHeader' as const;

  override description = 'Text added here will be placed first in the PR body.';
}

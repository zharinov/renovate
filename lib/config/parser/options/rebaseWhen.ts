import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const rebaseWhenValues = [
  'auto',
  'never',
  'conflicted',
  'behind-base-branch',
  'automerging',
] as const;

type RebaseWhenConfigKey = 'rebaseWhen';
type RebaseWhenConfigValue = (typeof rebaseWhenValues)[number];

export class RebaseWhenField<T extends EmptyConfig> extends StringField<
  T,
  RebaseWhenConfigKey,
  RebaseWhenConfigValue
> {
  override name = 'rebaseWhen' as const;

  override description = 'Controls when Renovate rebases an existing branch.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...rebaseWhenValues];
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PinDigestsField<T extends EmptyConfig> extends BooleanField<
  T,
  'pinDigests'
> {
  override name = 'pinDigests' as const;

  override description = 'Whether to add digests to Dockerfile source images.';

  override defaultValue = false;
}

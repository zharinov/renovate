import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const recreateWhenValues = ['auto', 'always', 'never'] as const;

type RecreateWhenConfigKey = 'recreateWhen';
type RecreateWhenConfigValue = (typeof recreateWhenValues)[number];

export class RecreateWhenField<T extends EmptyConfig> extends StringField<
  T,
  RecreateWhenConfigKey,
  RecreateWhenConfigValue
> {
  override name = 'recreateWhen' as const;

  override description =
    'Recreate PRs even if same ones were closed previously.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...recreateWhenValues];
}

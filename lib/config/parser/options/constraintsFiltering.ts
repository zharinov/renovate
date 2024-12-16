import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const constraintsFilteringValues = ['none', 'strict'] as const;

type ConstraintsFilteringConfigKey = 'constraintsFiltering';
type ConstraintsFilteringConfigValue =
  (typeof constraintsFilteringValues)[number];

export class ConstraintsFilteringField<
  T extends EmptyConfig,
> extends StringField<
  T,
  ConstraintsFilteringConfigKey,
  ConstraintsFilteringConfigValue
> {
  override name = 'constraintsFiltering' as const;

  override description =
    'Perform release filtering based on language constraints.';

  override defaultValue = 'none' as const;

  override allowedValues = [...constraintsFilteringValues];
}

import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const internalChecksFilterValues = ['strict', 'flexible', 'none'] as const;

type InternalChecksFilterConfigKey = 'internalChecksFilter';
type InternalChecksFilterConfigValue =
  (typeof internalChecksFilterValues)[number];

export class InternalChecksFilterField<
  T extends EmptyConfig,
> extends StringField<
  T,
  InternalChecksFilterConfigKey,
  InternalChecksFilterConfigValue
> {
  override name = 'internalChecksFilter' as const;

  override description = 'When and how to filter based on internal checks.';

  override defaultValue = 'strict' as const;

  override allowedValues = [...internalChecksFilterValues];
}

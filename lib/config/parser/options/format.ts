import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const formatValues = ['json', 'plain'] as const;

type FormatConfigKey = 'format';
type FormatConfigValue = (typeof formatValues)[number];

export class FormatField<T extends EmptyConfig> extends StringField<
  T,
  FormatConfigKey,
  FormatConfigValue
> {
  override name = 'format' as const;

  override description = 'Format of the custom datasource.';

  override defaultValue = 'json' as const;

  override allowedValues = [...formatValues];
}

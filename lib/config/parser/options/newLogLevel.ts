import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const newLogLevelValues = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;

type NewLogLevelConfigKey = 'newLogLevel';
type NewLogLevelConfigValue = (typeof newLogLevelValues)[number];

export class NewLogLevelField<
  T extends EmptyConfig,
> extends StringNullableField<T, NewLogLevelConfigKey, NewLogLevelConfigValue> {
  override name = 'newLogLevel' as const;

  override description = 'New log level to use if matchMessage matches.';

  override allowedValues = [...newLogLevelValues];
}

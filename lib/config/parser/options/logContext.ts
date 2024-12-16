import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type LogContextConfigKey = 'logContext';
type LogContextConfigValue = string;

export class LogContextField<T extends EmptyConfig> extends StringNullableField<
  T,
  LogContextConfigKey,
  LogContextConfigValue
> {
  override name = 'logContext' as const;

  override description =
    'Add a global or per-repo log context to each log entry.';
}

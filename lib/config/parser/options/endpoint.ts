import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type EndpointConfigKey = 'endpoint';
type EndpointConfigValue = string;

export class EndpointField<T extends EmptyConfig> extends StringNullableField<
  T,
  EndpointConfigKey,
  EndpointConfigValue
> {
  override name = 'endpoint' as const;

  override description = 'Custom endpoint to use.';
}

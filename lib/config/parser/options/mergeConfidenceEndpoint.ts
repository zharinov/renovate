import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type MergeConfidenceEndpointConfigKey = 'mergeConfidenceEndpoint';
type MergeConfidenceEndpointConfigValue = string;

export class MergeConfidenceEndpointField<
  T extends EmptyConfig,
> extends StringField<
  T,
  MergeConfidenceEndpointConfigKey,
  MergeConfidenceEndpointConfigValue
> {
  override name = 'mergeConfidenceEndpoint' as const;

  override description =
    'If set, Renovate will query this API for Merge Confidence data.';

  override defaultValue = 'https://developer.mend.io/' as const;
}

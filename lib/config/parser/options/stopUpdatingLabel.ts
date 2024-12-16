import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type StopUpdatingLabelConfigKey = 'stopUpdatingLabel';
type StopUpdatingLabelConfigValue = string;

export class StopUpdatingLabelField<T extends EmptyConfig> extends StringField<
  T,
  StopUpdatingLabelConfigKey,
  StopUpdatingLabelConfigValue
> {
  override name = 'stopUpdatingLabel' as const;

  override description = 'Label to make Renovate stop updating a PR.';

  override defaultValue = 'stop-updating' as const;
}

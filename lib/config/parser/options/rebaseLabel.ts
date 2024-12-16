import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type RebaseLabelConfigKey = 'rebaseLabel';
type RebaseLabelConfigValue = string;

export class RebaseLabelField<T extends EmptyConfig> extends StringField<
  T,
  RebaseLabelConfigKey,
  RebaseLabelConfigValue
> {
  override name = 'rebaseLabel' as const;

  override description = 'Label to request a rebase from Renovate bot.';

  override defaultValue = 'rebase' as const;
}

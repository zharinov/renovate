import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const modeValues = ['full', 'silent'] as const;

type ModeConfigKey = 'mode';
type ModeConfigValue = (typeof modeValues)[number];

export class ModeField<T extends EmptyConfig> extends StringField<
  T,
  ModeConfigKey,
  ModeConfigValue
> {
  override field = 'mode' as const;
  override defaultValue = 'full' as const;
  override allowedValues = [...modeValues];
}

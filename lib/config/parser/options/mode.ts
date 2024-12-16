import { StringField } from '../base/string-field';

const modeValues = ['full', 'silent'] as const;

type ModeConfigKey = 'mode';
type ModeConfigValue = (typeof modeValues)[number];

export class ModeField<T> extends StringField<
  T,
  ModeConfigKey,
  ModeConfigValue
> {
  field = 'mode' as const;
  override defaultValue = 'full' as const;
  override allowedValues = [...modeValues];
}

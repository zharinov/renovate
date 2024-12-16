import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const requireConfigValues = ['required', 'optional', 'ignored'] as const;

type RequireConfigConfigKey = 'requireConfig';
type RequireConfigConfigValue = (typeof requireConfigValues)[number];

export class RequireConfigField<T extends EmptyConfig> extends StringField<
  T,
  RequireConfigConfigKey,
  RequireConfigConfigValue
> {
  override name = 'requireConfig' as const;

  override description =
    "Controls Renovate's behavior regarding repository config files such as `renovate.json`.";

  override defaultValue = 'required' as const;

  override allowedValues = [...requireConfigValues];
}

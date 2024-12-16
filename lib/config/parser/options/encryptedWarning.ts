import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type EncryptedWarningConfigKey = 'encryptedWarning';
type EncryptedWarningConfigValue = string;

export class EncryptedWarningField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  EncryptedWarningConfigKey,
  EncryptedWarningConfigValue
> {
  override name = 'encryptedWarning' as const;

  override description = 'Warning text to use if encrypted config is found.';
}

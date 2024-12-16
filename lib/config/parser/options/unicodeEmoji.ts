import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class UnicodeEmojiField<T extends EmptyConfig> extends BooleanField<
  T,
  'unicodeEmoji'
> {
  override name = 'unicodeEmoji' as const;

  override description = 'Enable or disable Unicode emoji.';

  override defaultValue = true;
}

import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PrTitleStrictField<T extends EmptyConfig> extends BooleanField<
  T,
  'prTitleStrict'
> {
  override name = 'prTitleStrict' as const;

  override description =
    'Whether to bypass appending extra context to the Pull Request title.';

  override defaultValue = false;
}

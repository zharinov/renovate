import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const forkProcessingValues = ['auto', 'enabled', 'disabled'] as const;

type ForkProcessingConfigKey = 'forkProcessing';
type ForkProcessingConfigValue = (typeof forkProcessingValues)[number];

export class ForkProcessingField<T extends EmptyConfig> extends StringField<
  T,
  ForkProcessingConfigKey,
  ForkProcessingConfigValue
> {
  override name = 'forkProcessing' as const;

  override description =
    'Whether to process forked repositories. By default, all forked repositories are skipped when in `autodiscover` mode.';

  override defaultValue = 'auto' as const;

  override allowedValues = [...forkProcessingValues];
}

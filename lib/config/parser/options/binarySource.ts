import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const binarySourceValues = ['global', 'docker', 'install', 'hermit'] as const;

type BinarySourceConfigKey = 'binarySource';
type BinarySourceConfigValue = (typeof binarySourceValues)[number];

export class BinarySourceField<T extends EmptyConfig> extends StringField<
  T,
  BinarySourceConfigKey,
  BinarySourceConfigValue
> {
  override name = 'binarySource' as const;

  override description =
    'Controls how third-party tools like npm or Gradle are called: directly, via Docker sidecar containers, or via dynamic install.';

  override defaultValue = 'install' as const;

  override allowedValues = [...binarySourceValues];
}

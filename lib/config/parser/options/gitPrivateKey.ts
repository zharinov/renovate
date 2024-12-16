import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type GitPrivateKeyConfigKey = 'gitPrivateKey';
type GitPrivateKeyConfigValue = string;

export class GitPrivateKeyField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  GitPrivateKeyConfigKey,
  GitPrivateKeyConfigValue
> {
  override name = 'gitPrivateKey' as const;

  override description = 'PGP key to use for signing Git commits.';
}

import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type FollowTagConfigKey = 'followTag';
type FollowTagConfigValue = string;

export class FollowTagField<T extends EmptyConfig> extends StringNullableField<
  T,
  FollowTagConfigKey,
  FollowTagConfigValue
> {
  override name = 'followTag' as const;

  override description =
    'If defined, packages will follow this release tag exactly.';
}

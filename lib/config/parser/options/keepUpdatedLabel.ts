import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type KeepUpdatedLabelConfigKey = 'keepUpdatedLabel';
type KeepUpdatedLabelConfigValue = string;

export class KeepUpdatedLabelField<
  T extends EmptyConfig,
> extends StringNullableField<
  T,
  KeepUpdatedLabelConfigKey,
  KeepUpdatedLabelConfigValue
> {
  override name = 'keepUpdatedLabel' as const;

  override description =
    'If set, users can add this label to PRs to request they be kept updated with the base branch.';
}

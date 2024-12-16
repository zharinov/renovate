import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type BranchTopicConfigKey = 'branchTopic';
type BranchTopicConfigValue = string;

export class BranchTopicField<T extends EmptyConfig> extends StringField<
  T,
  BranchTopicConfigKey,
  BranchTopicConfigValue
> {
  override name = 'branchTopic' as const;

  override description = 'Branch topic.';

  override defaultValue =
    '{{{depNameSanitized}}}-{{{newMajor}}}{{#if separateMinorPatch}}{{#if isPatch}}.{{{newMinor}}}{{/if}}{{/if}}.x{{#if isLockfileUpdate}}-lockfile{{/if}}' as const;
}

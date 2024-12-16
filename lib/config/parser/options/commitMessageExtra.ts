import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type CommitMessageExtraConfigKey = 'commitMessageExtra';
type CommitMessageExtraConfigValue = string;

export class CommitMessageExtraField<T extends EmptyConfig> extends StringField<
  T,
  CommitMessageExtraConfigKey,
  CommitMessageExtraConfigValue
> {
  override name = 'commitMessageExtra' as const;

  override description =
    'Extra description used after the commit message topic - typically the version.';

  override defaultValue =
    'to {{#if isPinDigest}}{{{newDigestShort}}}{{else}}{{#if isMajor}}{{prettyNewMajor}}{{else}}{{#if isSingleVersion}}{{prettyNewVersion}}{{else}}{{#if newValue}}{{{newValue}}}{{else}}{{{newDigestShort}}}{{/if}}{{/if}}{{/if}}{{/if}}' as const;
}

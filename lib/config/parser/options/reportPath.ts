import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

type ReportPathConfigKey = 'reportPath';
type ReportPathConfigValue = string;

export class ReportPathField<T extends EmptyConfig> extends StringNullableField<
  T,
  ReportPathConfigKey,
  ReportPathConfigValue
> {
  override name = 'reportPath' as const;

  override description =
    'Path to where the file should be written. In case of `s3` this has to be a full S3 URI.';
}

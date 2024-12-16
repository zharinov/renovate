import { StringNullableField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const reportTypeValues = ['logging', 'file', 's3'] as const;

type ReportTypeConfigKey = 'reportType';
type ReportTypeConfigValue = (typeof reportTypeValues)[number];

export class ReportTypeField<T extends EmptyConfig> extends StringNullableField<
  T,
  ReportTypeConfigKey,
  ReportTypeConfigValue
> {
  override name = 'reportType' as const;

  override description = 'Set how, or if, reports should be generated.';

  override allowedValues = [...reportTypeValues];
}

import { emptyParser } from './base/empty-config-parser';
import { EnabledConfigOptionParser } from './options/enabled';
import { ModeConfigOptionParser } from './options/mode';

export const parser = emptyParser()
  .pipe(EnabledConfigOptionParser)
  .pipe(ModeConfigOptionParser);

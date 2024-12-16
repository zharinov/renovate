import { emptyParser } from './base/empty-parser';
import { EnabledField } from './options/enabled';
import { ModeField } from './options/mode';

export const parser = emptyParser().pipe(EnabledField).pipe(ModeField);


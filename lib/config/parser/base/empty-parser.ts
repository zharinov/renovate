import { AbstractConfigParser } from './abstract-parser';
import type { ParserContext, RawConfig } from './types';

export type EmptyConfig = Record<string, never>;

export class EmptyConfigParser extends AbstractConfigParser<
  EmptyConfig,
  EmptyConfig
> {
  parse(
    _accum: EmptyConfig,
    _rawConfig: RawConfig,
    _context: ParserContext,
  ): EmptyConfig {
    return {};
  }
}

export const emptyParser = (): EmptyConfigParser => new EmptyConfigParser();

import { AbstractConfigParser } from './abstract-parser';
import type { EmptyConfig, ParserContext, RawConfig } from './types';

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

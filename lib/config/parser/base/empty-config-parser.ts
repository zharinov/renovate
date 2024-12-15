import { AbstractConfigParser } from './abstract-config-parser';
import type { RawConfig } from './types';

export type EmptyConfig = Record<string, never>;

export class EmptyConfigParser extends AbstractConfigParser<
  EmptyConfig,
  EmptyConfig
> {
  parse(_accum: EmptyConfig, _rawConfig: RawConfig): EmptyConfig {
    return {};
  }
}

export const emptyParser = (): EmptyConfigParser => new EmptyConfigParser();

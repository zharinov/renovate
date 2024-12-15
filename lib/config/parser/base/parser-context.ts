import type { ParserContext } from './types';

export class ConfigParserContext implements ParserContext {
  private warnings: string[] = [];

  addWarning(message: string): void {
    this.warnings.push(message);
  }
}

export const parserContext = new ConfigParserContext();

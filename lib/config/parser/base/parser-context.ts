import type { ParserContext } from './types';

export class ConfigParserContext implements ParserContext {
  private warnings: [string, string][] = [];

  warning(key: string, message: string): void {
    this.warnings.push([key, message]);
  }
}

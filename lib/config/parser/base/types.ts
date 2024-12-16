export type RawConfig = Record<string, unknown>;

export type EmptyConfig = Record<string, never>;

export type ParserConstructor<T, DeltaT> = new () => ConfigParser<T, DeltaT>;

export interface ParserContext {
  warning(key: string, message: string): void;
}

export interface ConfigParser<T, DeltaT> {
  /**
   * @param accum - The configuration parsed from previous parsers (with type guarantees).
   * @param orig - The original configuration (without type guarantees).
   * @returns The updated configuration (with type guarantees).
   */
  parse(accum: T, rawConfig: RawConfig, context: ParserContext): T & DeltaT;

  /**
   * @param parser - The parser to chain.
   * @returns A new parser that combines the current parser with the given parser.
   */
  pipe<DeltaU>(
    ctor: ParserConstructor<T & DeltaT, DeltaU>,
  ): ConfigParser<T, DeltaT & DeltaU>;
}

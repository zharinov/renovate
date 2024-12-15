export type RawConfig = Record<string, unknown>;

export type ParserCtor<T, DeltaT> = new (
  ...args: any[]
) => ConfigParser<T, DeltaT>;

export interface ConfigParser<T, DeltaT> {
  /**
   * @param accum - The configuration parsed from previous parsers (with type guarantees).
   * @param orig - The original configuration (without type guarantees).
   * @returns The updated configuration (with type guarantees).
   */
  parse(accum: T, rawConfig: RawConfig): T & DeltaT;

  /**
   * @param parser - The parser to chain.
   * @returns A new parser that combines the current parser with the given parser.
   */
  pipe<DeltaU>(
    Ctor: ParserCtor<T & DeltaT, DeltaU>,
    ...args: any[]
  ): ConfigParser<T, DeltaT & DeltaU>;
}

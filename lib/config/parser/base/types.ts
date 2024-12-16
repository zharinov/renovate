export type RawConfig = Record<string, unknown>;

export type EmptyConfig = Record<string, never>;

export type Merge<T1, T2, T3 = unknown> = T1 & T2 & T3;

export type Pair<Key extends string, Value> = { [key in Key]: Value };

export type Extend<T extends EmptyConfig, Key extends string, Value> = Merge<
  T,
  Pair<Key, Value>
>;

export type InferParserResult<T extends ConfigParser<any, any>> =
  T['parse'] extends (accum: any, rawConfig: any, context: any) => infer R
    ? { [K in keyof R as R[K] extends never ? never : K]: R[K] }
    : never;

export type ParserConstructor<
  T extends EmptyConfig,
  DeltaT,
> = new () => ConfigParser<T, DeltaT>;

export interface ConfigParser<T extends EmptyConfig, DeltaT> {
  /**
   * @param accum - The configuration parsed from previous parsers (with type guarantees).
   * @param orig - The original configuration (without type guarantees).
   * @returns The updated configuration (with type guarantees).
   */
  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): Merge<T, DeltaT>;

  /**
   * @param parser - The parser to chain.
   * @returns A new parser that combines the current parser with the given parser.
   */
  pipe<DeltaU>(
    ctor: ParserConstructor<Merge<T, DeltaT>, DeltaU>,
  ): ConfigParser<T, Merge<DeltaT, DeltaU>>;
}

export interface ParserContext {
  warning(key: string, message: string): void;
}

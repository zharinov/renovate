import type {
  ConfigParser,
  EmptyConfig,
  Merge,
  ParserConstructor,
  ParserContext,
  RawConfig,
} from './types';

export class PipedConfigParser<T extends EmptyConfig, DeltaT1, DeltaT2>
  implements ConfigParser<T, Merge<DeltaT1, DeltaT2>>
{
  constructor(
    private readonly first: ConfigParser<T, DeltaT1>,
    private readonly second: ConfigParser<Merge<T, DeltaT1>, DeltaT2>,
  ) {}

  pipe<DeltaT3>(
    ctor: ParserConstructor<Merge<T, DeltaT1, DeltaT2>, DeltaT3>,
  ): PipedConfigParser<T, Merge<DeltaT1, DeltaT2>, DeltaT3> {
    const nextParser = new ctor();
    return new PipedConfigParser<T, Merge<DeltaT1, DeltaT2>, DeltaT3>(
      this,
      nextParser,
    );
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): Merge<T, DeltaT1, DeltaT2> {
    const firstAccum = this.first.parse(accum, rawConfig, context);
    return this.second.parse(firstAccum, rawConfig, context);
  }
}

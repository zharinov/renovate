import type {
  ConfigParser,
  ParserContext,
  ParserCtor,
  RawConfig,
} from './types';

export class PipedConfigParser<T, DeltaT1, DeltaT2>
  implements ConfigParser<T, DeltaT1 & DeltaT2>
{
  constructor(
    private readonly first: ConfigParser<T, DeltaT1>,
    private readonly second: ConfigParser<T & DeltaT1, DeltaT2>,
  ) {}

  pipe<DeltaT3>(
    Ctor: ParserCtor<T & DeltaT1 & DeltaT2, DeltaT3>,
    ...args: any[]
  ): PipedConfigParser<T, DeltaT1 & DeltaT2, DeltaT3> {
    const parser = new Ctor(this, ...args);
    return new PipedConfigParser<T, DeltaT1 & DeltaT2, DeltaT3>(this, parser);
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): T & DeltaT1 & DeltaT2 {
    const firstAccum = this.first.parse(accum, rawConfig, context);
    return this.second.parse(firstAccum, rawConfig, context);
  }
}

import { PipedConfigParser } from './piped-config-parser';
import type {
  ConfigParser,
  ParserContext,
  ParserCtor,
  RawConfig,
} from './types';

export abstract class AbstractConfigParser<T, DeltaT>
  implements ConfigParser<T, DeltaT>
{
  abstract parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): T & DeltaT;

  pipe<DeltaU>(
    Ctor: ParserCtor<T & DeltaT, DeltaU>,
    ...args: any[]
  ): ConfigParser<T, DeltaT & DeltaU> {
    const parser = new Ctor(this, ...args);
    return new PipedConfigParser<T, DeltaT, DeltaU>(this, parser);
  }
}

import { PipedConfigParser } from './piped-config-parser';
import type {
  ConfigParser,
  ParserConstructor,
  ParserContext,
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
    ctor: ParserConstructor<T & DeltaT, DeltaU>,
  ): ConfigParser<T, DeltaT & DeltaU> {
    const nextParser = new ctor();
    return new PipedConfigParser<T, DeltaT, DeltaU>(this, nextParser);
  }
}

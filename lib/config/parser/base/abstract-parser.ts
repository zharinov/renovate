import { PipedConfigParser } from './piped-parser';
import type {
  ConfigParser,
  EmptyConfig,
  Merge,
  ParserConstructor,
  ParserContext,
  RawConfig,
} from './types';

export abstract class AbstractConfigParser<T extends EmptyConfig, DeltaT>
  implements ConfigParser<T, DeltaT>
{
  abstract parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): Merge<T, DeltaT>;

  pipe<DeltaU>(
    ctor: ParserConstructor<Merge<T, DeltaT>, DeltaU>,
  ): ConfigParser<T, Merge<DeltaT, DeltaU>> {
    const nextParser = new ctor();
    return new PipedConfigParser<T, DeltaT, DeltaU>(this, nextParser);
  }
}

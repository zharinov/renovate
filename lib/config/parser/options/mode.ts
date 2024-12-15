import { AbstractConfigParser } from '../base/abstract-config-parser';
import type { RawConfig } from '../base/types';

export interface ModeConfigOption {
  mode: 'full' | 'silent';
}

export class ModeConfigOptionParser<T> extends AbstractConfigParser<
  T,
  ModeConfigOption
> {
  parse(accum: T, rawConfig: RawConfig): T & ModeConfigOption {
    const mode = 'mode' in rawConfig ? rawConfig.mode : 'full';

    if (mode !== 'full' && mode !== 'silent') {
      throw new Error('Invalid option');
    }

    return { ...accum, mode };
  }
}

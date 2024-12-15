import { AbstractConfigParser } from '../base/abstract-config-parser';
import type { RawConfig } from '../base/types';

export interface EnabledConfigOption {
  enabled: boolean;
}

export class EnabledConfigOptionParser<T> extends AbstractConfigParser<
  T,
  EnabledConfigOption
> {
  parse(accum: T, rawConfig: RawConfig): T & EnabledConfigOption {
    const value =
      'enabled' in rawConfig ? (rawConfig.enabled as boolean) : true;
    return { ...accum, enabled: value };
  }
}

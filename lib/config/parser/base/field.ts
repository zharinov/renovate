import { clone } from '../../../util/clone';
import { AbstractConfigParser } from './abstract-parser';
import type { ParserContext, RawConfig } from './types';

export abstract class StrictField<
  T,
  Key extends string,
  Value extends NonNullable<unknown>,
> extends AbstractConfigParser<T, { [key in Key]: Value }> {
  abstract field: Key;
  abstract defaultValue: Value;

  abstract isValidType: (value: unknown) => value is Value;

  readonly allowedValues?: Value[];

  private yield(accum: T, value: Value | null): T & { [key in Key]: Value } {
    const clonedValue = clone(value);
    return {
      ...accum,
      [this.field]: clonedValue,
    } as T & { [key in Key]: Value };
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): T & { [key in Key]: Value } {
    const key: Key = this.field;

    if (!(key in rawConfig)) {
      return this.yield(accum, this.defaultValue);
    }

    const rawValue = rawConfig[key];

    if (!this.isValidType(rawValue)) {
      context.warning(key, `Invalid value type for ${key}`);
      return this.yield(accum, this.defaultValue);
    }

    if (this.allowedValues && !this.allowedValues.includes(rawValue)) {
      context.warning(key, `Invalid value for ${key}`);
      return this.yield(accum, this.defaultValue);
    }

    return this.yield(accum, rawValue);
  }
}

export abstract class NullableField<
  T,
  Key extends string,
  Value extends NonNullable<unknown>,
> extends AbstractConfigParser<T, { [key in Key]: Value | null }> {
  abstract field: Key;

  abstract isValidType: (value: unknown) => value is Value;

  readonly allowedValues?: Value[];

  private yield(
    accum: T,
    value: Value | null,
  ): T & { [key in Key]: Value | null } {
    const clonedValue = clone(value);
    return {
      ...accum,
      [this.field]: clonedValue,
    } as T & { [key in Key]: Value | null };
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): T & { [key in Key]: Value | null } {
    const key: Key = this.field;

    if (!(key in rawConfig)) {
      return this.yield({ ...accum }, null);
    }

    const rawValue = rawConfig[key];

    if (!this.isValidType(rawValue)) {
      context.warning(key, `Invalid value type for ${key}`);
      return this.yield({ ...accum }, null);
    }

    if (this.allowedValues && !this.allowedValues.includes(rawValue)) {
      context.warning(key, `Invalid value for ${key}`);
      return this.yield({ ...accum }, null);
    }

    return this.yield(accum, rawValue);
  }
}

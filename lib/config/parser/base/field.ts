import { clone } from '../../../util/clone';
import { AbstractConfigParser } from './abstract-parser';
import type {
  EmptyConfig,
  Extend,
  Pair,
  ParserContext,
  RawConfig,
} from './types';

export abstract class StrictField<
  T extends EmptyConfig,
  Key extends string,
  Value extends NonNullable<unknown>,
> extends AbstractConfigParser<T, Pair<Key, Value>> {
  abstract name: Key;

  abstract description: string;

  abstract defaultValue: Value;

  readonly allowedValues?: Value[];

  abstract isValidType: (value: unknown) => value is Value;

  private yield(accum: T, value: Value | null): Extend<T, Key, Value> {
    const clonedValue = clone(value);
    return {
      ...accum,
      [this.name]: clonedValue,
    } as Extend<T, Key, Value>;
  }

  private pickExisting(accum: T, _context: ParserContext): Value {
    if (!(this.name in accum)) {
      return this.defaultValue;
    }

    const value = accum[this.name];

    if (!this.isValidType(value)) {
      return this.defaultValue;
    }

    if (this.allowedValues && !this.allowedValues.includes(value)) {
      return this.defaultValue;
    }

    return value;
  }

  private pickNew(
    rawConfig: RawConfig,
    existingValue: Value,
    context: ParserContext,
  ): Value {
    if (!(this.name in rawConfig)) {
      return existingValue;
    }

    const value = rawConfig[this.name];

    if (!this.isValidType(value)) {
      context.warning(this.name, `Invalid value type for ${this.name}`);
      return existingValue;
    }

    if (this.allowedValues && !this.allowedValues.includes(value)) {
      context.warning(this.name, `Invalid value for ${this.name}`);
      return existingValue;
    }

    return value;
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): Extend<T, Key, Value> {
    const existingValue = this.pickExisting(accum, context);
    const value = this.pickNew(rawConfig, existingValue, context);
    return this.yield(accum, value);
  }
}

export abstract class NullableField<
  T extends EmptyConfig,
  Key extends string,
  Value extends NonNullable<unknown>,
> extends AbstractConfigParser<T, Pair<Key, Value | null>> {
  abstract name: Key;

  abstract description: string;

  readonly allowedValues?: Value[];

  abstract isValidType: (value: unknown) => value is Value;

  private yield(accum: T, value: Value | null): Extend<T, Key, Value | null> {
    const clonedValue = clone(value);
    return {
      ...accum,
      [this.name]: clonedValue,
    } as Extend<T, Key, Value | null>;
  }

  private pickExisting(accum: T, _context: ParserContext): Value | null {
    if (!(this.name in accum)) {
      return null;
    }

    const value = accum[this.name];

    if (!this.isValidType(value)) {
      return null;
    }

    if (this.allowedValues && !this.allowedValues.includes(value)) {
      return null;
    }

    return value;
  }

  private pickNew(
    rawConfig: RawConfig,
    existingValue: Value | null,
    context: ParserContext,
  ): Value | null {
    if (!(this.name in rawConfig)) {
      return existingValue;
    }

    const value = rawConfig[this.name];

    if (!this.isValidType(value)) {
      context.warning(this.name, `Invalid value type for ${this.name}`);
      return null;
    }

    if (this.allowedValues && !this.allowedValues.includes(value)) {
      context.warning(this.name, `Invalid value for ${this.name}`);
      return null;
    }

    return value;
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): Extend<T, Key, Value | null> {
    const existingValue = this.pickExisting(accum, context);
    const value = this.pickNew(rawConfig, existingValue, context);
    return this.yield(accum, value);
  }
}

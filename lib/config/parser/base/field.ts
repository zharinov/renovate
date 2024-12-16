import { clone } from '../../../util/clone';
import { AbstractConfigParser } from './abstract-parser';
import type { EmptyConfig, ParserContext, RawConfig } from './types';

export abstract class StrictField<
  T extends EmptyConfig,
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

  private pickExisting(accum: T, _context: ParserContext): Value {
    if (!(this.field in accum)) {
      return this.defaultValue;
    }

    const value = accum[this.field];

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
    if (!(this.field in rawConfig)) {
      return existingValue;
    }

    const value = rawConfig[this.field];

    if (!this.isValidType(value)) {
      context.warning(this.field, `Invalid value type for ${this.field}`);
      return existingValue;
    }

    if (this.allowedValues && !this.allowedValues.includes(value)) {
      context.warning(this.field, `Invalid value for ${this.field}`);
      return existingValue;
    }

    return value;
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): T & { [key in Key]: Value } {
    const existingValue = this.pickExisting(accum, context);
    const value = this.pickNew(rawConfig, existingValue, context);
    return this.yield(accum, value);
  }
}

export abstract class NullableField<
  T extends EmptyConfig,
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

  private pickExisting(accum: T, _context: ParserContext): Value | null {
    if (!(this.field in accum)) {
      return null;
    }

    const value = accum[this.field];

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
    if (!(this.field in rawConfig)) {
      return existingValue;
    }

    const value = rawConfig[this.field];

    if (!this.isValidType(value)) {
      context.warning(this.field, `Invalid value type for ${this.field}`);
      return null;
    }

    if (this.allowedValues && !this.allowedValues.includes(value)) {
      context.warning(this.field, `Invalid value for ${this.field}`);
      return null;
    }

    return value;
  }

  parse(
    accum: T,
    rawConfig: RawConfig,
    context: ParserContext,
  ): T & { [key in Key]: Value | null } {
    const existingValue = this.pickExisting(accum, context);
    const value = this.pickNew(rawConfig, existingValue, context);
    return this.yield(accum, value);
  }
}

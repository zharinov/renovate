import { NullableField, StrictField } from './field';
import type { EmptyConfig } from './types';

export abstract class IntegerField<
  T extends EmptyConfig,
  Key extends string,
  Value extends number = number,
> extends StrictField<T, Key, Value> {
  protected allowNegative = false;

  isValidType = (value: unknown): value is Value => {
    if (!(typeof value === 'number')) {
      return false;
    }

    if (!Number.isInteger(value)) {
      return false;
    }

    if (!this.allowNegative && value < 0) {
      return false;
    }

    return true;
  };
}

export abstract class IntegerNullableField<
  T extends EmptyConfig,
  Key extends string,
  Value extends number = number,
> extends NullableField<T, Key, Value> {
  protected allowNegative = false;

  override isValidType = (value: unknown): value is Value => {
    if (!(typeof value === 'number')) {
      return false;
    }

    if (!Number.isInteger(value)) {
      return false;
    }

    if (!this.allowNegative && value < 0) {
      return false;
    }

    return true;
  };
}

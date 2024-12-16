import { NullableField, StrictField } from './field';
import type { EmptyConfig } from './types';

export abstract class IntegerField<
  T extends EmptyConfig,
  Key extends string,
  Value extends number = number,
> extends StrictField<T, Key, Value> {
  isValidType = (value: unknown): value is Value =>
    typeof value === 'number' && Number.isInteger(value);
}

export abstract class IntegerNullableField<
  T extends EmptyConfig,
  Key extends string,
  Value extends number = number,
> extends NullableField<T, Key, Value> {
  isValidType = (value: unknown): value is Value =>
    typeof value === 'number' && Number.isInteger(value);
}

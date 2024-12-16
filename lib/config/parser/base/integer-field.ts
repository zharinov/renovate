import { NullableField, StrictField } from './field';

export abstract class IntegerField<
  T,
  Key extends string,
  Value extends number = number,
> extends StrictField<T, Key, Value> {
  isValidType = (value: unknown): value is Value =>
    typeof value === 'number' && Number.isInteger(value);
}

export abstract class IntegerNullableField<
  T,
  Key extends string,
  Value extends number = number,
> extends NullableField<T, Key, Value> {
  isValidType = (value: unknown): value is Value =>
    typeof value === 'number' && Number.isInteger(value);
}

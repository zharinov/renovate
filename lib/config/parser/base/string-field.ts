import { NullableField, StrictField } from './field';

export abstract class StringField<
  T,
  Key extends string,
  Value extends string = string,
> extends StrictField<T, Key, Value> {
  isValidType = (value: unknown): value is Value => typeof value === 'string';
}

export abstract class StringNullableField<
  T,
  Key extends string,
  Value extends string = string,
> extends NullableField<T, Key, Value> {
  isValidType = (value: unknown): value is Value => typeof value === 'string';
}

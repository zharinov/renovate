import { NullableField, StrictField } from './field';

const isValidType = (value: unknown): value is boolean =>
  typeof value === 'boolean';

export abstract class BooleanField<T, Key extends string> extends StrictField<
  T,
  Key,
  boolean
> {
  isValidType = isValidType;
}

export abstract class BooleanNullableField<
  T,
  Key extends string,
> extends NullableField<T, Key, boolean> {
  isValidType = isValidType;
}

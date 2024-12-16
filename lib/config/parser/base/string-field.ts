import { NullableField, StrictField } from './field';
import type { EmptyConfig } from './types';

export abstract class StringField<
  T extends EmptyConfig,
  Key extends string,
  Value extends string = string,
> extends StrictField<T, Key, Value> {
  isValidType = (value: unknown): value is Value => typeof value === 'string';
}

export abstract class StringNullableField<
  T extends EmptyConfig,
  Key extends string,
  Value extends string = string,
> extends NullableField<T, Key, Value> {
  isValidType = (value: unknown): value is Value => typeof value === 'string';
}

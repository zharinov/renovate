import { NullableField, StrictField } from './field';
import type { EmptyConfig } from './types';

const isValidType = (value: unknown): value is boolean =>
  typeof value === 'boolean';

export abstract class BooleanField<
  T extends EmptyConfig,
  Key extends string,
> extends StrictField<T, Key, boolean> {
  isValidType = isValidType;
}

export abstract class BooleanNullableField<
  T extends EmptyConfig,
  Key extends string,
> extends NullableField<T, Key, boolean> {
  isValidType = isValidType;
}

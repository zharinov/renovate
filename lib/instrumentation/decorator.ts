import { SpanKind } from '@opentelemetry/api';
import type { SpanParameters } from './types';
import { instrument as instrumentFunc } from '.';

/**
 * Instruments a decorated method.
 */
export function instrument({
  name,
  attributes,
  ignoreParentSpan,
  kind = SpanKind.INTERNAL,
}: SpanParameters) {
  return function <This, Args extends any[], Return>(
    method: (this: This, ...args: Args) => Promise<Return>,
    _context: ClassMethodDecoratorContext<This>,
  ): (this: This, ...args: Args) => Promise<Return> {
    return async function (this: This, ...args: Args): Promise<Return> {
      return (await instrumentFunc(name, () => method.apply(this, args), {
        attributes,
        root: ignoreParentSpan,
        kind,
      })) as Return;
    };
  };
}

export function instrumentStandalone<T extends (...args: any[]) => any>(
  {
    name,
    attributes,
    ignoreParentSpan,
    kind = SpanKind.INTERNAL,
  }: SpanParameters,
  fn: T,
): T {
  return async function (...args: any[]) {
    return await instrumentFunc(name, () => fn(...args), {
      attributes,
      root: ignoreParentSpan,
      kind,
    });
  } as T;
}

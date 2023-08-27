import is from '@sindresorhus/is';
import acorn from 'acorn';
import * as walk from 'acorn-walk';
import { Delta, diff as jsonDiff } from 'jsondiffpatch';
import textDiff from 'textdiff-create';
import type { JsonObject, JsonValue } from 'type-fest';
import { uniq } from './uniq';

const x = `
  {
    "foo": [1, 2, 3],
    "bar": { "baz": 42 },
    "baz": false
  }
`;

const y = `
  {
    "foo": [
      1,
      2,
      3,
    ],
    "bar": {
      "baz": 420
    },
    "baz": false,
    "quux": 123
  }
`;

jsonDiff({ a: 1 }, { a: 2 }); //?
jsonDiff({ a: { b: 1 } }, { a: { b: 2 } }); //?
jsonDiff({ a: [1, 2] }, { a: [1, 3] }); //?
jsonDiff({ a: 'foo' }, { a: 'bar' }); //?
jsonDiff({ a: 1, b: 2 }, { a: 1 }); //?
jsonDiff({ foo: 123 }, { bar: 123 }); //?

type Range = {
  start: number;
  end: number;
};

type NestedRanges = {
  type: 'object' | 'array' | 'kv-pair' | 'other';
  range: Range;
  children: NestedRanges[];
};

type AcornExpressionNode = acorn.Node & {
  expression: acorn.Node;
};

type AcornProgramNode = acorn.Node & {
  body: [AcornExpressionNode];
};

type AcornObjectKVPairNode = acorn.Node & {
  start: number;
  end: number;
  key: acorn.Node;
  value: acorn.Node;
};

// function isAcornObjectKVPair(node: acorn.Node): node is AcornObjectKVPairNode {
//   return node.type === 'Property';
// }

type AcornObjectNode = acorn.Node & {
  start: number;
  end: number;
  properties: AcornObjectKVPairNode[];
};

function isAcornObject(node: acorn.Node): node is AcornObjectNode {
  return node.type === 'ObjectExpression';
}

type AcornArrayNode = acorn.Node & {
  elements: acorn.Node[];
};

function isAcornArray(node: acorn.Node): node is AcornArrayNode {
  return node.type === 'ArrayExpression';
}

function getJsonAst(json: string): acorn.Node {
  const parser = new acorn.Parser(
    {
      ecmaVersion: 2019,
      sourceType: 'script',
      locations: false,
      ranges: false,
    },
    `(${json})`
  );

  const progRoot = parser.parse() as AcornProgramNode; //?
  const rootExpr = progRoot?.body?.[0]?.expression; //?

  if (!rootExpr) {
    throw new Error('Could not parse JSON');
  }

  walk.full(rootExpr, (node) => {
    if (isAcornObject(node)) {
      for (const prop of node.properties) {
        prop.key.start -= 1;
        prop.key.end -= 1;
      }
    }

    node.start -= 1;
    node.end -= 1;
  });

  return rootExpr;
}

getJsonAst(`{ "a": 1, "b": 2 }`); //?
getJsonAst(`{ "a": 42 }`); //?
getJsonAst(`[1, 2, 3]`); //?
getJsonAst(`{ a: 42 }`); //?
getJsonAst(`{ "a": [42] }`); //?
getJsonAst(`{ foo: ["a", "b", "c"] }`); //?

function stripPositions(ast: acorn.Node): void {
  walk.full(ast, (node) => {
    if (isAcornObject(node)) {
      for (const prop of node.properties) {
        prop.key.start = 0;
        prop.key.end = 0;
      }
    }

    node.start = 0;
    node.end = 0;
  });
}

function extractPositions(node: acorn.Node): NestedRanges {
  const range: Range = {
    start: node.start,
    end: node.end,
  };

  if (isAcornObject(node)) {
    const result: NestedRanges = {
      type: 'object',
      range,
      children: [],
    };

    for (const kvPair of node.properties) {
      const child = extractPositions(kvPair.value);
      result.children.push({
        type: 'kv-pair',
        range: {
          start: kvPair.start,
          end: kvPair.end,
        },
        children: [child],
      });
    }

    return result;
  }

  if (isAcornArray(node)) {
    const result: NestedRanges = {
      type: 'array',
      range,
      children: [],
    };

    for (const element of node.elements) {
      const child = extractPositions(element);
      result.children.push(child);
    }

    return result;
  }

  return {
    type: 'other',
    range,
    children: [],
  };
}

JSON.stringify(extractPositions(getJsonAst(`{ "a": 1, "b": 2 }`)), null, 2); //?
extractPositions(getJsonAst(`{ "a": 42 }`)); //?
extractPositions(getJsonAst(`{ "a": { "b": 42 } }`)); //?
extractPositions(getJsonAst(`[1, 2, 3]`)); //?
extractPositions(getJsonAst(`{ a: 42 }`)); //?
extractPositions(getJsonAst(`{ "a": [42] }`)); //?
extractPositions(getJsonAst(`{ foo: ["a", "b", "c"] }`)); //?

interface ObjectDiff {
  type: 'object';
  properties: {
    [key: number]:
      | StructuralDiff
      | 'key-added'
      | 'key-changed'
      | 'kv-changed'
      | 'value-changed';
  };
}

interface ArrayDiff {
  type: 'array';
  elements: {
    [key: number]: StructuralDiff | 'element-added' | 'value-changed';
  };
}

type StructuralDiff = ObjectDiff | ArrayDiff | 'value-changed';

function minimizeDiff(diff: Delta): StructuralDiff {
  if (is.plainObject(diff)) {
    // Object diff
    if (is.plainObject(diff.properties)) {
      const result: ObjectDiff = { type: 'object', properties: {} };
      for (const [k, v] of Object.entries(diff.properties)) {
        const key = Number(k);
        if (Number.isNaN(key)) {
          continue;
        }

        const value = v as Delta;

        if (is.array(value)) {
          result.properties[key] = 'key-added';
          continue;
        }

        if (is.plainObject(value.key)) {
          if (is.plainObject(value.value)) {
            result.properties[key] = 'kv-changed';
            continue;
          }

          result.properties[key] = 'key-changed';
          continue;
        }

        if (is.plainObject(value)) {
          result.properties[key] = minimizeDiff(value);
          continue;
        }
      }

      return result;
    }

    // Array diff
    if (is.plainObject(diff.elements)) {
      const result: ArrayDiff = { type: 'array', elements: {} };
      for (const [k, v] of Object.entries(diff.elements)) {
        const key = Number(k);
        if (Number.isNaN(key)) {
          continue;
        }

        const value = v as Delta;

        if (is.array(value)) {
          result.elements[key] = 'element-added';
          continue;
        }

        if (is.plainObject(value)) {
          result.elements[key] = minimizeDiff(value);
          continue;
        }
      }
      return result;
    }

    if (is.plainObject(diff.value)) {
      return minimizeDiff(diff.value);
    }
  }

  return 'value-changed';
}

function jsonStructuralDiff(
  before: string,
  after: string
): StructuralDiff | null {
  const beforeAst = getJsonAst(before);
  const afterAst = getJsonAst(after);

  stripPositions(beforeAst);
  stripPositions(afterAst);
  const astDiff = jsonDiff(beforeAst, afterAst);
  if (!astDiff) {
    return null;
  }

  return minimizeDiff(astDiff);
}

jsonStructuralDiff(`{ "a": 1 }`, `{ "a": 1, "b": 2 }`); //?
jsonStructuralDiff(`{ "a": 1 }`, `{ "a": 2 }`); //?
jsonStructuralDiff(`{ "a": 1 }`, `{ "b": 1 }`); //?
jsonStructuralDiff(`{ "a": 1 }`, `{ "b": 2 }`); //?
jsonStructuralDiff(`{ "a": 1 }`, `{ "b": 2, "c": 3 }`); //?
jsonStructuralDiff(`{ "a": { "b": 1 } }`, `{ "a": { "b": 2 } }`); //?
jsonStructuralDiff(`{ "a": { "b": 1 } }`, `{ "a": { "c": 3, "d": 4 } }`); //?
jsonStructuralDiff(`{ "a": 1 }`, `{ "a": 2, "b": 2, "c": 3 }`); //?
jsonStructuralDiff(`[1]`, `[1, 2]`); //?
jsonStructuralDiff(`[1, 2, 3]`, `[1, 22, 3, 4]`); //?
jsonStructuralDiff(`{ "a": [1] }`, `{ "a": 42 }`); //?
jsonStructuralDiff(`{ "a": { "b": [1] }}`, `{ "a": { "d": [1, 2] }}`); //?
jsonStructuralDiff(x, y); //?

function detectChangedPositions(before: string, after: string): Range[] {
  const beforeAst = getJsonAst(before);
  const afterAst = getJsonAst(after);

  const posInfo = extractPositions(beforeAst);
  stripPositions(beforeAst);
  stripPositions(afterAst);
  const astDiff = jsonDiff(beforeAst, afterAst);
  if (!astDiff) {
    return [];
  }

  const structuralDiff = minimizeDiff(astDiff);

  const result: Range[] = [];

  function walkSubtree(diff: StructuralDiff, pos: NestedRanges): void {
    if (diff === 'value-changed') {
      result.push(pos.range);
      return;
    }

    if (diff.type === 'object') {
      for (const [key, value] of Object.entries(diff.properties)) {
        const keyNum = Number(key);
        if (Number.isNaN(keyNum)) {
          continue;
        }

        if (value === 'key-added') {
          const prevChild = pos.children[keyNum - 1]; //?
          if (prevChild) {
            result.push({
              start: prevChild.range.end,
              end: prevChild.range.end,
            });
            continue;
          }

          const nextChild = pos.children[keyNum]; //?
          if (nextChild) {
            result.push({
              start: nextChild.range.start,
              end: nextChild.range.start,
            });
            continue;
          }

          result.push(pos.range);
          continue;
        }

        const child = pos.children[keyNum]; //?
        if (!child) {
          break;
        }

        if (value === 'key-changed' || value === 'kv-changed') {
          result.push(child.range);
          continue;
        }

        if (value === 'value-changed') {
          result.push(child.children[0].range);
          continue;
        }

        child.children[0];
        walkSubtree(value, child.children[0]);
      }
    }

    if (diff.type === 'array') {
      for (const [key, value] of Object.entries(diff.elements)) {
        const keyNum = Number(key);
        if (Number.isNaN(keyNum)) {
          continue;
        }

        if (value === 'element-added') {
          const prevChild = pos.children[keyNum - 1]; //?
          if (prevChild) {
            result.push({
              start: prevChild.range.end,
              end: prevChild.range.end,
            });
            continue;
          }

          const nextChild = pos.children[keyNum]; //?
          if (nextChild) {
            result.push({
              start: nextChild.range.start,
              end: nextChild.range.start,
            });
            continue;
          }

          result.push(pos.range);
          continue;
        }

        const child = pos.children[keyNum];
        if (!child) {
          break;
        }

        if (value === 'value-changed') {
          result.push(child.range);
          continue;
        }

        walkSubtree(value, child);
      }
    }
  }

  walkSubtree(structuralDiff, posInfo);

  return uniq(result, (x, y) => x.start === y.start && x.end === y.end).sort(
    (x, y) => x.start - y.start
  );
}

detectChangedPositions(`{ "a": 1 }`, `{ "a": 1, "b": 2 }`); //?
detectChangedPositions(`{ "a": 1 }`, `{ "a": 1 }`); //?
detectChangedPositions(`{ "a": 1 }`, `{ "b": 1 }`); //?
detectChangedPositions(`{ "a": 1 }`, `{ "a": 2 }`); //?
detectChangedPositions(`{ "a": 1 }`, `{ "a": 1, "b": 2 }`); //?
detectChangedPositions(`{ "a": [1] }`, `{ "a": [1, 2] }`); //?
detectChangedPositions(`{ "a": { "b": [1] }}`, `{ "a": { "d": [1, 2] }}`); //?

detectChangedPositions(x, y); //?

// textDiff(x, y); //?
// textDiff('abc', 'abc'); //?
// textDiff('abc', 'abcd'); //?
// textDiff('abc', 'ab'); //?
// textDiff('abc', 'a'); //?
// textDiff('ab de', 'abcde'); //?

import is from '@sindresorhus/is';
import acorn from 'acorn';
import * as walk from 'acorn-walk';
import { Delta, diff as jsonDiff } from 'jsondiffpatch';
import textDiff from 'textdiff-create';
import type { JsonObject, JsonValue } from 'type-fest';

jsonDiff({ a: 1 }, { a: 2 }); //?
jsonDiff({ a: { b: 1 } }, { a: { b: 2 } }); //?
jsonDiff({ a: [1, 2] }, { a: [1, 3] }); //?
jsonDiff({ a: 'foo' }, { a: 'bar' }); //?
jsonDiff({ a: 1, b: 2 }, { a: 1 }); //?
jsonDiff({ foo: 123 }, { bar: 123 }); //?

type PositionRange = {
  start: number;
  end: number;
};

type PositionInfo = {
  range: PositionRange;
  children: PositionInfo[];
};

type JsonAstResult = {
  ast: acorn.Node;
  pos: PositionInfo;
};

type AcornExpressionNode = acorn.Node & {
  expression: acorn.Node;
};

type AcornProgramNode = acorn.Node & {
  body: [AcornExpressionNode];
};

type AcornObjectNode = acorn.Node & {
  properties: {
    start: number;
    end: number;
    key: acorn.Node;
    value: acorn.Node;
  }[];
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

  return rootExpr;
}

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

getJsonAst(`{ "a": 42 }`); //?
getJsonAst(`[1, 2, 3]`); //?
getJsonAst(`{ a: 42 }`); //?
getJsonAst(`{ "a": [42] }`); //?
getJsonAst(`{ foo: ["a", "b", "c"] }`); //?

function extractPositions(node: acorn.Node): PositionInfo {
  const OFFSET = 1;

  const result: PositionInfo = {
    range: {
      start: node.start - OFFSET,
      end: node.end - OFFSET,
    },
    children: [],
  };

  if (isAcornObject(node)) {
    for (const prop of node.properties) {
      const child = extractPositions(prop.value);
      result.children.push(child);
    }

    return result;
  }

  if (isAcornArray(node)) {
    for (const element of node.elements) {
      const child = extractPositions(element);
      result.children.push(child);
    }

    return result;
  }

  return result;
}

extractPositions(getJsonAst(`{ "a": 42 }`)); //?
extractPositions(getJsonAst(`[1, 2, 3]`)); //?
extractPositions(getJsonAst(`{ a: 42 }`)); //?
extractPositions(getJsonAst(`{ "a": [42] }`)); //?
extractPositions(getJsonAst(`{ foo: ["a", "b", "c"] }`)); //?

type MinimizedDiff = {
  [key: number]: MinimizedDiff | null;
} | null;

function minimizeDiffChildren(
  indexedObject: Record<string | number | symbol, unknown>
): MinimizedDiff {
  const result: MinimizedDiff = {};
  delete indexedObject._t;
  for (const [key, value] of Object.entries(indexedObject)) {
    const idx = Number(key);
    if (Number.isNaN(idx)) {
      continue;
    }
    result[idx] = minimizeDiff(value as Delta);
  }

  return result;
}

function minimizeDiff(diff: Delta): MinimizedDiff {
  if (is.plainObject(diff)) {
    if (is.plainObject(diff.properties)) {
      return minimizeDiffChildren(diff.properties);
    }

    if (is.plainObject(diff.elements)) {
      return minimizeDiffChildren(diff.elements);
    }

    if (is.plainObject(diff.value)) {
      return minimizeDiff(diff.value as JsonObject);
    }
  }

  return null;
}

function detectChangedPositions(
  before: string,
  after: string
): PositionRange[] {
  const beforeAst = getJsonAst(before);
  const afterAst = getJsonAst(after);

  const posInfo = extractPositions(beforeAst); //?
  stripPositions(beforeAst);
  stripPositions(afterAst);

  const result: PositionRange[] = [];
  const astDiff = jsonDiff(beforeAst, afterAst);
  if (!astDiff) {
    return result;
  }

  const affectedSubtree = minimizeDiff(astDiff); //?
  function walkSubtree(subtree: MinimizedDiff, posInfo: PositionInfo): void {
    if (subtree === null) {
      return;
    }

    for (const [key, value] of Object.entries(subtree)) {
      const idx = Number(key);
      if (Number.isNaN(idx)) {
        continue;
      }

      const childPosInfo = posInfo.children[idx];
      if (!childPosInfo) {
        result.push(posInfo.range);
        continue;
      }

      if (value === null) {
        result.push(childPosInfo.range);
        continue;
      }

      walkSubtree(value, childPosInfo);
    }
  }

  walkSubtree(affectedSubtree, posInfo);

  return result;
}

detectChangedPositions(`{ "a": 1 }`, `{ "a": 1 }`); //?
detectChangedPositions(`{ "a": 1 }`, `{ "a": 2 }`); //?
detectChangedPositions(`{ "a": 1 }`, `{ "a": 1, "b": 2 }`); //?
detectChangedPositions(`{ "a": [1] }`, `{ "a": [1, 2] }`); //?
detectChangedPositions(`{ "a": { "b": [1] }}`, `{ "a": { "b": [1, 2] }}`); //?

const x = `
  {
    "foo": [1, 2, 3],
    "bar": { "baz": 42 }
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
    "quux": 123
  }
`;

detectChangedPositions(x, y); //?
textDiff(x, y); //?

textDiff('abc', 'abc'); //?
textDiff('abc', 'abcd'); //?
textDiff('abc', 'ab'); //?
textDiff('abc', 'a'); //?
textDiff('ab de', 'abcde'); //?

import is from '@sindresorhus/is';
import { getCustomEnv } from '../env';
import { getChildProcessEnv } from './env';
import type { ExecOptions } from './types';

export function getChildEnv({
  extraEnv,
  userConfiguredEnv,
  env: forcedEnv = {},
}: ExecOptions): Record<string, string> {
  const globalConfigEnv = getCustomEnv();

  const inheritedKeys: string[] = [];
  for (const [key, val] of Object.entries(extraEnv ?? {})) {
    if (is.string(val)) {
      inheritedKeys.push(key);
    }
  }

  const parentEnv = getChildProcessEnv(inheritedKeys);
  const combinedEnv = {
    ...extraEnv,
    ...parentEnv,
    ...globalConfigEnv,
    ...userConfiguredEnv,
    ...forcedEnv,
  };

  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(combinedEnv)) {
    if (is.string(val)) {
      result[key] = `${val}`;
    }
  }

  return result;
}

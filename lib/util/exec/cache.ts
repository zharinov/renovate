import { join } from 'upath';
import { getGlobalConfig } from '../../config/global';
import { logger } from '../../logger';
import { chmod, ensureCacheDir, exists, readdir, remove, stat } from '../fs';
import { getCachedTmpDirId, resetCachedTmpDirId } from './cache-id';
import { volumeCreate, volumePrune } from './docker/volume';

export * from './cache-id';

export function getCachedTmpDirNs(): string {
  const { dockerChildPrefix } = getGlobalConfig();
  const rawPrefix = dockerChildPrefix || 'renovate';
  const prefix: string = rawPrefix.replace(/\//g, '_').replace(/_+$/, '');
  const suffix = 'tmpdir_cache';
  return `${prefix}_${suffix}`;
}

// @See https://github.com/renovatebot/renovate/issues/9748
async function fixFilePermissionsBeforeDelete(entry: string): Promise<void> {
  try {
    if (await exists(entry)) {
      const stats = await stat(entry);
      if (stats.isDirectory()) {
        await chmod(entry, '755');
        const children = await readdir(entry);
        for (const child of children) {
          await fixFilePermissionsBeforeDelete(join(entry, child));
        }
      } else if (stats.isFile()) {
        await chmod(entry, '644');
      }
    }
  } catch (err) {
    logger.debug({ err }, 'Permissions fixing error');
  }
}

async function purgeCacheRoot(): Promise<void> {
  const { cacheDir } = getGlobalConfig();
  const cacheNs = getCachedTmpDirNs();
  const cacheRoot = join(cacheDir, cacheNs);
  if (await exists(cacheRoot)) {
    logger.trace(`Deleting cache root: ${cacheRoot}`);
    try {
      await remove(cacheRoot);
    } catch (err) {
      await fixFilePermissionsBeforeDelete(cacheRoot);
      await remove(cacheRoot);
    }
  }
}

export async function purgeCachedTmpDirs(): Promise<void> {
  resetCachedTmpDirId();
  const { binarySource, dockerCache } = getGlobalConfig();
  if (binarySource === 'docker') {
    const cacheNs = getCachedTmpDirNs();
    if (dockerCache === 'volume') {
      logger.trace(`Deleting Docker cache volume: ${cacheNs}_*`);
      await volumePrune({ renovate: cacheNs });
    } else if (dockerCache === 'folder') {
      await purgeCacheRoot();
    }
  } else {
    await purgeCacheRoot();
  }
}

async function ensureCacheRoot(): Promise<void> {
  const cacheNs = getCachedTmpDirNs();
  const cacheId = getCachedTmpDirId();
  const cacheRoot = join(cacheNs, cacheId);
  logger.trace(`Creating cache root: ${cacheRoot}`);
  await ensureCacheDir(cacheRoot);
}

export async function ensureCachedTmpDir(): Promise<void> {
  const { binarySource, dockerCache } = getGlobalConfig();
  const cacheNs = getCachedTmpDirNs();
  const cacheId = getCachedTmpDirId();
  if (binarySource === 'docker') {
    if (dockerCache === 'volume') {
      const cacheName = `${cacheNs}_${cacheId}`;
      logger.trace(`Creating Docker cache volume: ${cacheName}`);
      await volumeCreate(cacheName, { renovate: cacheNs });
    } else if (dockerCache === 'folder') {
      await ensureCacheRoot();
    }
  } else {
    await ensureCacheRoot();
  }
}

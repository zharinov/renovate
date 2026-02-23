import cacache from 'cacache';
import { DateTime } from 'luxon';
import upath from 'upath';
import { logger } from '../../../../logger/index.ts';
import { compressToBase64, decompressFromBase64 } from '../../../compress.ts';
import type { PackageCacheNamespace } from '../types.ts';
import { PackageCacheBase } from './base.ts';

export class PackageCacheFile extends PackageCacheBase {
  static create(cacheDir: string): PackageCacheFile {
    const cacheFileName = upath.join(cacheDir, '/renovate/renovate-cache-v1');
    logger.debug(`Initializing Renovate internal cache into ${cacheFileName}`);
    return new PackageCacheFile(cacheFileName);
  }

  private readonly cacheFileName: string;

  private constructor(cacheFileName: string) {
    super();
    this.cacheFileName = cacheFileName;
  }

  private getKey(namespace: PackageCacheNamespace, key: string): string {
    return `${namespace}-${key}`;
  }

  override async get<T = unknown>(
    namespace: PackageCacheNamespace,
    key: string,
  ): Promise<T | undefined> {
    try {
      const res = await cacache.get(
        this.cacheFileName,
        this.getKey(namespace, key),
      );
      const cachedValue = JSON.parse(res.data.toString());
      if (cachedValue) {
        if (DateTime.local() < DateTime.fromISO(cachedValue.expiry)) {
          logger.trace({ namespace, key }, 'Returning cached value');
          if (!cachedValue.compress) {
            return cachedValue.value;
          }
          const res = await decompressFromBase64(cachedValue.value);
          return JSON.parse(res);
        }
        await this.rm(namespace, key);
      }
    } catch {
      logger.trace({ namespace, key }, 'Cache miss');
    }
    return undefined;
  }

  override async set(
    namespace: PackageCacheNamespace,
    key: string,
    value: unknown,
    hardTtlMinutes: number,
  ): Promise<void> {
    logger.trace({ namespace, key, hardTtlMinutes }, 'Saving cached value');
    await cacache.put(
      this.cacheFileName,
      this.getKey(namespace, key),
      JSON.stringify({
        compress: true,
        value: await compressToBase64(JSON.stringify(value)),
        expiry: DateTime.local().plus({ minutes: hardTtlMinutes }),
      }),
    );
  }

  override async destroy(): Promise<void> {
    logger.debug('Checking file package cache for expired items');
    let totalCount = 0;
    let deletedCount = 0;
    const startTime = Date.now();
    let errorCount = 0;
    for await (const item of cacache.ls.stream(this.cacheFileName)) {
      try {
        totalCount += 1;
        const cachedItem = item as unknown as cacache.CacheObject;
        const res = await cacache.get(this.cacheFileName, cachedItem.key);
        let cachedValue: any;
        try {
          cachedValue = JSON.parse(res.data.toString());
        } catch {
          logger.debug('Error parsing cached value - deleting');
        }
        if (
          !cachedValue ||
          (cachedValue?.expiry &&
            DateTime.local() > DateTime.fromISO(cachedValue.expiry))
        ) {
          await cacache.rm.entry(this.cacheFileName, cachedItem.key);
          await cacache.rm.content(this.cacheFileName, cachedItem.integrity);
          deletedCount += 1;
        }
      } catch (err) {
        logger.trace({ err }, 'Error cleaning up cache entry');
        errorCount += 1;
      }
    }
    if (errorCount > 0) {
      logger.debug(`Error count cleaning up cache: ${errorCount}`);
    }
    const durationMs = Math.round(Date.now() - startTime);
    logger.debug(
      `Deleted ${deletedCount} of ${totalCount} file cached entries in ${durationMs}ms`,
    );
  }

  private async rm(
    namespace: PackageCacheNamespace,
    key: string,
  ): Promise<void> {
    logger.trace({ namespace, key }, 'Removing cache entry');
    await cacache.rm.entry(this.cacheFileName, this.getKey(namespace, key));
  }
}

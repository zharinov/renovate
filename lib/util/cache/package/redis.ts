/* istanbul ignore file */
import { DateTime } from 'luxon';
import { commandOptions, createClient } from 'redis';
import { logger } from '../../../logger';
import { compress, decompress, decompressFromBase64 } from '../../compress';
import type { PackageCacheNamespace } from './types';

let client: ReturnType<typeof createClient> | undefined;
let rprefix: string | undefined;

function getKey(namespace: PackageCacheNamespace, key: string): string {
  return `${rprefix}${namespace}-${key}`;
}

export async function end(): Promise<void> {
  try {
    // https://github.com/redis/node-redis#disconnecting
    await client?.disconnect();
  } catch (err) {
    logger.warn({ err }, 'Redis cache end failed');
  }
}

export async function decodeLegacyValue<T = never>(
  value: Buffer,
): Promise<T | undefined> {
  try {
    const cachedValue = JSON.parse(value.toString());
    if (cachedValue) {
      if (DateTime.local() < DateTime.fromISO(cachedValue.expiry)) {
        // istanbul ignore if
        if (!cachedValue.compress) {
          return cachedValue.value;
        }
        const res = await decompressFromBase64(cachedValue.value);
        return JSON.parse(res);
      }
    }
  } catch (err) {
    logger.trace({ err }, 'Cache legacy decode error');
  }
  return undefined;
}

const legacyPrefix1 = Buffer.from('{"compress":');
const legacyPrefix2 = Buffer.from('{"value":');
const legacyPrefix3 = Buffer.from('{"expiry":');
const legacySuffix = Buffer.from('}');

function bufferStartsWith(buf: Buffer, prefix: Buffer): boolean {
  if (buf.length < prefix.length) {
    return false;
  }
  for (let i = 0; i < prefix.length; i++) {
    if (buf[i] !== prefix[i]) {
      return false;
    }
  }
  return true;
}

function bufferEndsWith(buf: Buffer, suffix: Buffer): boolean {
  if (buf.length < suffix.length) {
    return false;
  }
  for (let i = 0; i < suffix.length; i++) {
    if (buf[buf.length - 1 - i] !== suffix[suffix.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

function isLegacyValue(buf: Buffer): boolean {
  return (
    (bufferStartsWith(buf, legacyPrefix1) ||
      bufferStartsWith(buf, legacyPrefix2) ||
      bufferStartsWith(buf, legacyPrefix3)) &&
    bufferEndsWith(buf, legacySuffix)
  );
}

export async function get<T = never>(
  namespace: PackageCacheNamespace,
  key: string,
): Promise<T | undefined> {
  if (!client) {
    return undefined;
  }

  try {
    const cacheKey = getKey(namespace, key);
    const cacheValue = await client.get(
      commandOptions({ returnBuffers: true }),
      cacheKey,
    );
    if (!cacheValue) {
      logger.trace({ rprefix, namespace, key }, 'Cache miss');
      return undefined;
    }

    logger.trace({ rprefix, namespace, key }, 'Returning cached value');

    if (isLegacyValue(cacheValue)) {
      return decodeLegacyValue(cacheValue);
    }

    const decompressedBuffer = await decompress(cacheValue);
    const jsonValue = decompressedBuffer.toString('utf8');
    return JSON.parse(jsonValue);
  } catch (err) {
    logger.trace({ rprefix, namespace, key, err }, 'Unknown cache error');
  }

  logger.trace(`cache.get(${namespace}, ${key})`);
}

export async function set(
  namespace: PackageCacheNamespace,
  key: string,
  value: unknown,
  ttlMinutes = 5,
): Promise<void> {
  if (!client) {
    return;
  }

  logger.trace({ rprefix, namespace, key, ttlMinutes }, 'Saving cached value');

  // Redis requires TTL to be integer, not float
  const redisTTL = Math.floor(ttlMinutes * 60);

  try {
    const cacheKey = getKey(namespace, key);
    const jsonValue = JSON.stringify(value);
    const compressedBuffer = await compress(Buffer.from(jsonValue, 'utf8'));
    await client.set(cacheKey, compressedBuffer, { EX: redisTTL });
  } catch (err) {
    logger.once.warn({ err }, 'Error while setting Redis cache value');
  }
}

export async function init(
  url: string,
  prefix: string | undefined,
): Promise<void> {
  if (!url) {
    return;
  }
  rprefix = prefix ?? '';
  logger.debug('Redis cache init');
  client = createClient({
    url,
    socket: {
      reconnectStrategy: (retries) => {
        // Reconnect after this time
        return Math.min(retries * 100, 3000);
      },
    },
    pingInterval: 30000, // 30s
  });
  await client.connect();
  logger.debug('Redis cache connected');
}

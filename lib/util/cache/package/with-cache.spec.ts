import { DateTime } from 'luxon';
import { dir as tmpDir } from 'tmp-promise';
import { expectTypeOf, type MockInstance } from 'vitest';
import { GlobalConfig } from '../../../config/global.ts';
import * as memCache from '../memory/index.ts';
import * as packageCache from './index.ts';
import { type CachedOptions, withCache } from './with-cache.ts';

describe('util/cache/package/with-cache', () => {
  let setCache: MockInstance<typeof packageCache.setWithRawTtl>;
  let dirResult: Awaited<ReturnType<typeof tmpDir>>;
  const getValue = vi.fn();
  let count = 1;

  beforeEach(async () => {
    vi.useRealTimers();
    GlobalConfig.reset();
    memCache.init();
    dirResult = await tmpDir({ unsafeCleanup: true });
    setCache = vi.spyOn(packageCache, 'setWithRawTtl');
    await packageCache.init({ cacheDir: dirResult.path });
    count = 1;
    getValue.mockImplementation(() => {
      const res = String(100 * count + 10 * count + count);
      count += 1;
      return Promise.resolve(res);
    });
  });

  afterEach(async () => {
    setCache.mockRestore();
    await packageCache.cleanup({});
    await dirResult.cleanup();
  });

  it('infers the privacy predicate value from the loader', async () => {
    const result = await withCache(
      {
        namespace: '_test-namespace',
        key: 'inferred',
        cacheable: (value) => {
          expectTypeOf(value).toEqualTypeOf<{ isPrivate: boolean }>();
          return !value.isPrivate;
        },
      },
      () => ({ isPrivate: false }),
    );

    expectTypeOf(result).toEqualTypeOf<{ isPrivate: boolean }>();
    expect(result).toEqual({ isPrivate: false });
  });

  it('requires synchronous predicates accepting the complete result type', () => {
    type Policy = NonNullable<CachedOptions<{ isPrivate: boolean } | null>['cacheable']>;

    expectTypeOf<(value: { isPrivate: boolean }) => boolean>().not.toExtend<Policy>();
    expectTypeOf<(value: { isPrivate: boolean } | null) => Promise<boolean>>().not.toExtend<Policy>();
  });

  describe('result privacy policy', () => {
    const options = {
      namespace: '_test-namespace' as const,
      key: 'privacy',
      ttlMinutes: 1,
      fallback: true,
      cacheable: (value: { isPrivate?: boolean } | undefined) =>
        value?.isPrivate === false,
    };

    it.each([false, true, undefined])('admits only explicit public results (%s)', async (isPrivate) => {
      const value = { isPrivate };
      const fetch = vi.fn(async () => value);

      await expect(withCache(options, fetch)).resolves.toEqual(value);
      await expect(withCache(options, fetch)).resolves.toEqual(value);

      expect(fetch).toHaveBeenCalledTimes(isPrivate === false ? 1 : 2);
      expect(setCache).toHaveBeenCalledTimes(isPrivate === false ? 1 : 0);
    });

    it.each([true, undefined])('rejects warm and stale legacy values (%s)', async (isPrivate) => {
      for (const minutes of [0, 2]) {
        await packageCache.setWithRawTtl('_test-namespace', 'cache-decorator:privacy', {
          cachedAt: DateTime.local().minus({ minutes }).toISO(),
          value: { isPrivate },
        }, 10);
        const fetch = vi.fn(async (): Promise<{ isPrivate?: boolean }> => {
          throw new Error('fetch failed');
        });

        await expect(withCache(options, fetch)).rejects.toThrow('fetch failed');
        expect(fetch).toHaveBeenCalledOnce();
      }
    });

    it('permits stale public fallback', async () => {
      GlobalConfig.set({ cacheHardTtlMinutes: 10 });
      await packageCache.setWithRawTtl('_test-namespace', 'cache-decorator:privacy', {
        cachedAt: DateTime.local().minus({ minutes: 2 }).toISO(),
        value: { isPrivate: false },
      }, 10);

      await expect(withCache(options, async () => { throw new Error('offline'); })).resolves.toEqual({ isPrivate: false });
    });

    it('overrides privacy without overriding quality and rejects override records later', async () => {
      GlobalConfig.set({ cachePrivatePackages: true });
      const fetch = vi.fn(async () => ({ isPrivate: true }));

      await withCache({ ...options, shouldCacheResult: () => false }, fetch);
      expect(setCache).not.toHaveBeenCalled();
      await withCache(options, fetch);
      await withCache(options, fetch);
      expect(fetch).toHaveBeenCalledTimes(2);

      GlobalConfig.set({ cachePrivatePackages: false });
      await withCache(options, fetch);
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(setCache).toHaveBeenCalledTimes(1);
    });

    it.each(['yes', undefined, Promise.resolve(true)])('rejects non-boolean runtime decisions (%s)', async (decision) => {
      const fetch = vi.fn(() => ({ isPrivate: false }));
      const cacheable = () => decision as unknown as boolean;

      await withCache({ ...options, cacheable }, fetch);
      await withCache({ ...options, cacheable }, fetch);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(setCache).not.toHaveBeenCalled();
    });

    it('does not call the privacy predicate or write for undefined', async () => {
      const predicate = vi.fn(() => true);

      await expect(withCache({ ...options, cacheable: predicate }, () => undefined)).resolves.toBeUndefined();

      expect(predicate).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
    });

    it('does not convert predicate exceptions into fetch fallback', async () => {
      GlobalConfig.set({ cacheHardTtlMinutes: 10 });
      await packageCache.setWithRawTtl('_test-namespace', 'cache-decorator:privacy', {
        cachedAt: DateTime.local().minus({ minutes: 2 }).toISO(),
        value: { isPrivate: false },
      }, 10);
      const policyError = new Error('policy failed');
      const predicate = vi.fn((value: { isPrivate?: boolean }) => {
        if (value.isPrivate) { throw policyError; }
        return true;
      });

      await expect(withCache({ ...options, cacheable: predicate }, () => ({ isPrivate: true }))).rejects.toBe(policyError);
      await expect(withCache({ ...options, cacheable: () => { throw policyError; } }, () => ({ isPrivate: false }))).rejects.toBe(policyError);
    });

    it('returns a fresh denied result without revoking an older accepted value', async () => {
      GlobalConfig.set({ cacheHardTtlMinutes: 10 });
      const old = { isPrivate: false };
      await packageCache.setWithRawTtl('_test-namespace', 'cache-decorator:privacy', {
        cachedAt: DateTime.local().minus({ minutes: 2 }).toISO(), value: old,
      }, 10);
      setCache.mockClear();

      await expect(withCache(options, () => ({ isPrivate: true }))).resolves.toEqual({ isPrivate: true });
      await expect(withCache(options, async () => { throw new Error('offline'); })).resolves.toEqual(old);
      expect(setCache).not.toHaveBeenCalled();
    });
  });

  it('caches string result', async () => {
    function fn() {
      return getValue();
    }

    await expect(
      withCache({ namespace: '_test-namespace', key: 'some-key' }, fn),
    ).resolves.toBe('111');
    await expect(
      withCache({ namespace: '_test-namespace', key: 'some-key' }, fn),
    ).resolves.toBe('111');
    await expect(
      withCache({ namespace: '_test-namespace', key: 'some-key' }, fn),
    ).resolves.toBe('111');

    expect(getValue).toHaveBeenCalledTimes(1);
    expect(setCache).toHaveBeenCalledExactlyOnceWith(
      '_test-namespace',
      'cache-decorator:some-key',
      { cachedAt: expect.any(String), value: '111' },
      30,
    );
  });

  it('disables cache if cacheable is false', async () => {
    function fn() {
      return getValue();
    }

    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', cacheable: false },
        fn,
      ),
    ).resolves.toBe('111');
    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', cacheable: false },
        fn,
      ),
    ).resolves.toBe('222');
    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', cacheable: false },
        fn,
      ),
    ).resolves.toBe('333');

    expect(getValue).toHaveBeenCalledTimes(3);
    expect(setCache).not.toHaveBeenCalled();
  });

  it('forces cache if cachePrivatePackages=true', async () => {
    GlobalConfig.set({ cachePrivatePackages: true });
    function fn() {
      return getValue();
    }

    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', cacheable: false },
        fn,
      ),
    ).resolves.toBe('111');
    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', cacheable: false },
        fn,
      ),
    ).resolves.toBe('111');
    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', cacheable: false },
        fn,
      ),
    ).resolves.toBe('111');

    expect(getValue).toHaveBeenCalledTimes(1);
    expect(setCache).toHaveBeenCalledExactlyOnceWith(
      '_test-namespace',
      'cache-decorator:key',
      { cachedAt: expect.any(String), value: '111' },
      30,
    );
  });

  it('caches null values', async () => {
    async function fn(): Promise<string | null> {
      await getValue();
      return null;
    }

    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, fn),
    ).resolves.toBeNull();
    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, fn),
    ).resolves.toBeNull();
    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, fn),
    ).resolves.toBeNull();

    expect(getValue).toHaveBeenCalledTimes(1);
    expect(setCache).toHaveBeenCalledExactlyOnceWith(
      '_test-namespace',
      'cache-decorator:key',
      { cachedAt: expect.any(String), value: null },
      30,
    );
  });

  it('does not cache values rejected by cacheResult predicate', async () => {
    async function fn(): Promise<string | null> {
      await getValue();
      return null;
    }
    function shouldCacheResult(value: unknown): boolean {
      return value !== null;
    }

    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', shouldCacheResult },
        fn,
      ),
    ).resolves.toBeNull();
    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', shouldCacheResult },
        fn,
      ),
    ).resolves.toBeNull();
    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', shouldCacheResult },
        fn,
      ),
    ).resolves.toBeNull();

    expect(getValue).toHaveBeenCalledTimes(3);
    expect(setCache).not.toHaveBeenCalled();
  });

  it('ignores cached values rejected by cacheResult predicate', async () => {
    async function nullFn(): Promise<string | null> {
      await getValue();
      return null;
    }
    function fn() {
      return getValue();
    }
    function cacheResult(value: unknown): boolean {
      return value !== null;
    }

    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, nullFn),
    ).resolves.toBeNull();
    await expect(
      withCache(
        {
          namespace: '_test-namespace',
          key: 'key',
          shouldCacheResult: cacheResult,
        },
        fn,
      ),
    ).resolves.toBe('222');
    await expect(
      withCache(
        {
          namespace: '_test-namespace',
          key: 'key',
          shouldCacheResult: cacheResult,
        },
        fn,
      ),
    ).resolves.toBe('222');

    expect(getValue).toHaveBeenCalledTimes(2);
    expect(setCache).toHaveBeenCalledTimes(2);
    expect(setCache).toHaveBeenLastCalledWith(
      '_test-namespace',
      'cache-decorator:key',
      { cachedAt: expect.any(String), value: '222' },
      30,
    );
  });

  it('does not cache undefined', async () => {
    async function fn(): Promise<string | undefined> {
      await getValue();
      return undefined;
    }

    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, fn),
    ).resolves.toBeUndefined();
    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, fn),
    ).resolves.toBeUndefined();
    await expect(
      withCache({ namespace: '_test-namespace', key: 'key' }, fn),
    ).resolves.toBeUndefined();

    expect(getValue).toHaveBeenCalledTimes(3);
    expect(setCache).not.toHaveBeenCalled();
  });

  it('uses custom ttlMinutes', async () => {
    function fn() {
      return getValue();
    }

    await expect(
      withCache(
        { namespace: '_test-namespace', key: 'key', ttlMinutes: 60 },
        fn,
      ),
    ).resolves.toBe('111');

    expect(setCache).toHaveBeenCalledExactlyOnceWith(
      '_test-namespace',
      'cache-decorator:key',
      { cachedAt: expect.any(String), value: '111' },
      60,
    );
  });

  describe('fallback with hard TTL', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      GlobalConfig.set({ cacheHardTtlMinutes: 2 });
    });

    it('updates cached result after soft TTL expires', async () => {
      function fn() {
        return getValue();
      }

      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(60 * 1000 - 1);
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '111' },
        2,
      );

      vi.advanceTimersByTime(1);
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('222');
      expect(getValue).toHaveBeenCalledTimes(2);
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '222' },
        2,
      );
    });

    it('overrides soft ttl and updates result', async () => {
      GlobalConfig.set({
        cacheTtlOverride: { '_test-namespace': 2 },
        cacheHardTtlMinutes: 3,
      });
      function fn() {
        return getValue();
      }

      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '111' },
        3,
      );

      vi.advanceTimersByTime(120 * 1000 - 1);
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('222');
      expect(getValue).toHaveBeenCalledTimes(2);
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '222' },
        3,
      );
    });

    it('returns stale result on error', async () => {
      function fn() {
        return getValue();
      }

      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '111' },
        2,
      );

      vi.advanceTimersByTime(60 * 1000);
      getValue.mockRejectedValueOnce(new Error('test'));
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(2);
      expect(setCache).toHaveBeenCalledTimes(1);
    });

    it('does not return stale values rejected by cacheResult predicate', async () => {
      async function nullFn(): Promise<string | null> {
        await getValue();
        return null;
      }
      function fn() {
        return getValue();
      }
      function shouldCacheResult(value: unknown): boolean {
        return value !== null;
      }

      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          nullFn,
        ),
      ).resolves.toBeNull();
      expect(getValue).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(60 * 1000);
      getValue.mockRejectedValueOnce(new Error('test'));
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
            shouldCacheResult,
          },
          fn,
        ),
      ).rejects.toThrow('test');
      expect(getValue).toHaveBeenCalledTimes(2);
      expect(setCache).toHaveBeenCalledTimes(1);
    });

    it('drops stale value after hard TTL expires', async () => {
      function fn() {
        return getValue();
      }

      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '111' },
        2,
      );

      vi.advanceTimersByTime(2 * 60 * 1000 - 1);
      getValue.mockRejectedValueOnce(new Error('test'));
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).resolves.toBe('111');

      vi.advanceTimersByTime(1);
      getValue.mockRejectedValueOnce(new Error('test'));
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: true,
          },
          fn,
        ),
      ).rejects.toThrow('test');
    });

    it('does not use fallback when fallback=false', async () => {
      function fn() {
        return getValue();
      }

      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: false,
          },
          fn,
        ),
      ).resolves.toBe('111');
      expect(getValue).toHaveBeenCalledTimes(1);
      // Without fallback, hard TTL equals soft TTL
      expect(setCache).toHaveBeenLastCalledWith(
        '_test-namespace',
        'cache-decorator:key',
        { cachedAt: expect.any(String), value: '111' },
        1,
      );

      vi.advanceTimersByTime(60 * 1000);
      getValue.mockRejectedValueOnce(new Error('test'));
      // Error should propagate since fallback is disabled
      await expect(
        withCache(
          {
            namespace: '_test-namespace',
            key: 'key',
            ttlMinutes: 1,
            fallback: false,
          },
          fn,
        ),
      ).rejects.toThrow('test');
    });
  });
});

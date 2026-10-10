import { DateTime } from 'luxon';
import { dir as tmpDir } from 'tmp-promise';
import { Fixtures } from '~test/fixtures.ts';
import * as httpMock from '~test/http-mock.ts';
import { GlobalConfig } from '../../../config/global.ts';
import { EXTERNAL_HOST_ERROR } from '../../../constants/error-messages.ts';
import * as memCache from '../../../util/cache/memory/index.ts';
import * as packageCache from '../../../util/cache/package/index.ts';
import * as hostRules from '../../../util/host-rules.ts';
import { getPkgReleases } from '../index.ts';
import { datasource, defaultRegistryUrl } from './common.ts';
import { CondaDatasource } from './index.ts';

const packageName = 'main/pytest';
const depUrl = `/${packageName}`;

describe('modules/datasource/conda/index', () => {
  beforeEach(() => {
    GlobalConfig.reset();
    memCache.init();
  });

  describe('privacy cache integration', () => {
    let directory: Awaited<ReturnType<typeof tmpDir>>;
    const config = {
      datasource,
      packageName: 'main/pytest',
      registryUrls: ['https://api.anaconda.org/package/'],
    };

    beforeEach(async () => {
      GlobalConfig.reset();
      memCache.init();
      directory = await tmpDir({ unsafeCleanup: true });
      await packageCache.init({ cacheDir: directory.path });
    });

    afterEach(async () => {
      await packageCache.cleanup({});
      await directory.cleanup();
      GlobalConfig.reset();
    });

    it.each([true, false, undefined, null])(
      'checks parsed visibility before cache reuse (%s)',
      async (visibility) => {
        const body = { public: visibility, versions: ['1.0.0'] };
        const isPublic = visibility === true;
        httpMock
          .scope('https://api.anaconda.org/package/')
          .get('/main/pytest')
          .times(isPublic ? 1 : 2)
          .reply(200, body);

        await expect(getPkgReleases(config)).resolves.toMatchObject({
          isPrivate: !isPublic,
        });
        memCache.init();
        await expect(getPkgReleases(config)).resolves.toMatchObject({
          isPrivate: !isPublic,
        });

        const cached = await packageCache.get(
          'datasource-conda',
          'cache-decorator:https://api.anaconda.org/package:main/pytest',
        );
        expect(!!cached).toBe(isPublic);
      },
    );

    it('does not share credential-bearing public responses', async () => {
      hostRules.add({
        matchHost: 'https://api.anaconda.org/package/',
        token: 'test-token',
      });
      httpMock
        .scope('https://api.anaconda.org/package/')
        .get('/main/pytest')
        .times(2)
        .reply(200, { public: true, versions: ['1.0.0'] });

      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: true,
      });
      memCache.init();
      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: true,
      });
    });

    it('does not store empty results, even with the privacy override', async () => {
      GlobalConfig.set({ cachePrivatePackages: true });
      httpMock
        .scope('https://api.anaconda.org/package/')
        .get('/main/pytest')
        .times(2)
        .reply(200, { versions: [] });

      await expect(getPkgReleases(config)).resolves.toBeNull();
      memCache.init();
      await expect(getPkgReleases(config)).resolves.toBeNull();
    });

    it('accepts explicit public access metadata', async () => {
      httpMock
        .scope(defaultRegistryUrl)
        .get('/main/pytest')
        .reply(200, {
          public: true,
          access: 'public',
          versions: ['1.0.0'],
        });

      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: false,
      });
      memCache.init();
      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: false,
      });
    });

    it('treats contradictory access metadata as restricted', async () => {
      httpMock
        .scope(defaultRegistryUrl)
        .get('/main/pytest')
        .reply(200, {
          public: true,
          access: 'private',
          versions: ['1.0.0'],
        });

      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: true,
      });
    });

    it('ignores old outer and unclassified inner records', async () => {
      const legacy = { releases: [{ version: '0.0.0' }] };
      await packageCache.set(
        'datasource-releases-conda',
        'https://api.anaconda.org/package:main/pytest',
        legacy,
        30,
      );
      await packageCache.setWithRawTtl(
        'datasource-conda',
        'cache-decorator:https://api.anaconda.org/package:main/pytest',
        { cachedAt: new Date().toISOString(), value: legacy },
        30,
      );
      httpMock
        .scope('https://api.anaconda.org/package/')
        .get('/main/pytest')
        .reply(200, { public: false, versions: ['1.0.0'] });

      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: true,
      });
    });

    it('rejects public flags on custom registries', async () => {
      httpMock
        .scope('https://internal.example')
        .get('/main/pytest')
        .reply(200, { public: true, versions: ['1.0.0'] });

      await expect(
        getPkgReleases({
          ...config,
          registryUrls: ['https://internal.example/'],
        }),
      ).resolves.toMatchObject({ isPrivate: true });
    });

    it('rejects administrator-admitted private records when the override is disabled', async () => {
      GlobalConfig.set({ cachePrivatePackages: true });
      httpMock
        .scope('https://api.anaconda.org/package/')
        .get('/main/pytest')
        .times(2)
        .reply(200, { public: false, versions: ['1.0.0'] });
      await getPkgReleases(config);
      memCache.init();
      GlobalConfig.set({ cachePrivatePackages: false });

      await expect(getPkgReleases(config)).resolves.toMatchObject({
        isPrivate: true,
      });
    });
  });

  describe('getReleases', () => {
    it('throws for error', async () => {
      httpMock.scope(defaultRegistryUrl).get(depUrl).replyWithError('error');
      await expect(
        getPkgReleases({
          datasource,
          packageName,
        }),
      ).rejects.toThrow(EXTERNAL_HOST_ERROR);
    });

    it('returns null for 404', async () => {
      httpMock.scope(defaultRegistryUrl).get(depUrl).reply(404);
      await expect(
        getPkgReleases({
          datasource,
          packageName,
        }),
      ).resolves.toBeNull();
    });

    it('returns null for empty result', async () => {
      httpMock
        .scope(defaultRegistryUrl)
        .get(depUrl)
        .reply(200, { versions: [] });
      await expect(
        getPkgReleases({
          datasource,
          packageName,
        }),
      ).resolves.toBeNull();
    });

    it('throws for 5xx', async () => {
      httpMock.scope(defaultRegistryUrl).get(depUrl).reply(502);
      await expect(
        getPkgReleases({
          datasource,
          packageName,
        }),
      ).rejects.toThrow(EXTERNAL_HOST_ERROR);
    });

    it('processes real data', async () => {
      httpMock
        .scope(defaultRegistryUrl)
        .get(depUrl)
        .reply(200, Fixtures.get('pytest.json'));
      const res = await getPkgReleases({
        datasource,
        packageName,
      });
      expect(res).toMatchObject({
        homepage: 'http://anaconda.org/anaconda/pytest',
        sourceUrl: 'https://github.com/pytest-dev/pytest',
        releases: [
          { version: '2.3.3' },
          { version: '2.3.4' },
          { version: '2.3.5' },
          { version: '2.4.2' },
          { version: '2.5.1' },
          { version: '2.5.2' },
          { version: '2.6.0' },
          { version: '2.6.1' },
          { version: '2.6.2' },
          { version: '2.6.3' },
          { version: '2.6.4' },
          { version: '2.7.0' },
          { version: '2.7.1' },
          { version: '2.7.2' },
          { version: '2.8.0' },
          { version: '2.8.1' },
          { version: '2.8.5' },
          { version: '2.9.1' },
          { version: '2.9.2' },
          { version: '3.0.3' },
          { version: '3.0.4' },
          { version: '3.0.5' },
          { version: '3.0.6' },
          { version: '3.0.7' },
          { version: '3.1.1' },
          { version: '3.1.2' },
          { version: '3.1.3' },
          { version: '3.2.1' },
          { version: '3.2.5' },
          { version: '3.3.0' },
          { version: '3.3.2' },
          { version: '3.4.0' },
          { version: '3.4.1' },
          { version: '3.4.2' },
          { version: '3.5.0' },
          { version: '3.5.1' },
          { version: '3.6.0' },
          { version: '3.6.1' },
          { version: '3.6.2' },
          { version: '3.6.3' },
          { version: '3.6.4' },
          { version: '3.7.1' },
          { version: '3.7.2' },
          { version: '3.7.3' },
          { version: '3.7.4' },
          { version: '3.8.0' },
          { version: '3.8.1' },
          { version: '3.8.2' },
          { version: '3.9.1' },
          { version: '3.9.3' },
          { version: '3.10.0', releaseTimestamp: '2020-02-28T11:46:01.948Z' },
          { version: '3.10.1' },
          { version: '4.0.0' },
          { version: '4.0.1' },
          { version: '4.0.2' },
          { version: '4.1.0' },
          { version: '4.1.1' },
          { version: '4.2.0' },
          { version: '4.2.1' },
          { version: '4.3.0' },
          { version: '4.3.1' },
          { version: '4.4.0' },
          { version: '4.4.1' },
          { version: '4.4.2' },
          { version: '4.5.0' },
          { version: '4.6.2' },
          { version: '4.6.11' },
          { version: '5.0.0' },
          { version: '5.0.1' },
          { version: '5.1.1' },
          { version: '5.1.2' },
          { version: '5.2.0' },
          { version: '5.2.1' },
          { version: '5.2.2' },
          { version: '5.2.4' },
          { version: '5.3.0' },
          { version: '5.3.1' },
          { version: '5.3.2' },
          { version: '5.3.4' },
          { version: '5.3.5' },
          { version: '5.4.1' },
          { version: '5.4.2' },
          { version: '5.4.3' },
          { version: '6.0.1' },
          { version: '6.0.2' },
          { version: '6.1.0' },
          { version: '6.1.1' },
          { version: '6.1.2' },
          { version: '6.2.0' },
          { version: '6.2.1' },
          { version: '6.2.2' },
          { version: '6.2.3' },
          { version: '6.2.4' },
          { version: '6.2.5' },
        ],
      });
    });

    it('returns null without registryUrl', async () => {
      const condaDatasource = new CondaDatasource();
      const res = await condaDatasource.getReleases({
        registryUrl: '',
        packageName,
      });
      expect(res).toBeNull();
    });

    it('handles null html_url and dev_url without throwing', async () => {
      const packageName = 'pytest';
      httpMock
        .scope('https://api.anaconda.org/package/conda-forge')
        .get(`/${packageName}`)
        .reply(200, {
          html_url: null,
          dev_url: null,
          versions: ['1.0.0'],
          files: [],
        });
      const res = await getPkgReleases({
        registryUrls: ['https://api.anaconda.org/package/conda-forge'],
        datasource,
        packageName,
      });
      expect(res).toMatchObject({ releases: [{ version: '1.0.0' }] });
      expect(res?.homepage).toBeUndefined();
      expect(res?.sourceUrl).toBeUndefined();
    });

    it('supports multiple custom datasource urls', async () => {
      const packageName = 'pytest';
      httpMock
        .scope('https://api.anaconda.org/package/rapids')
        .get(`/${packageName}`)
        .reply(404);
      httpMock
        .scope('https://api.anaconda.org/package/conda-forge')
        .get(`/${packageName}`)
        .reply(200, {
          html_url: 'http://anaconda.org/anaconda/pytest',
          dev_url: 'https://github.com/pytest-dev/pytest/',
          versions: ['2.7.0', '2.5.1', '2.6.0'],
          files: [],
        });
      const config = {
        registryUrls: [
          'https://api.anaconda.org/package/rapids',
          'https://api.anaconda.org/package/conda-forge',
          'https://api.anaconda.org/package/nvidia',
        ],
      };
      const res = await getPkgReleases({
        ...config,
        datasource,
        packageName,
      });
      expect(res).toMatchObject({
        homepage: 'http://anaconda.org/anaconda/pytest',
        registryUrl: 'https://api.anaconda.org/package/conda-forge',
        releases: [
          { version: '2.5.1' },
          { version: '2.6.0' },
          { version: '2.7.0' },
        ],
        sourceUrl: 'https://github.com/pytest-dev/pytest',
      });
    });

    it('supports channel from prefix.dev with null response', async () => {
      httpMock
        .scope('https://prefix.dev/api/graphql')
        .post('')
        .reply(200, { data: { package: { variants: null } } });

      const config = {
        packageName: 'pytest',
        registryUrls: ['https://prefix.dev/conda-forge'],
      };
      const res = await getPkgReleases({
        ...config,
        datasource,
      });
      expect(res).toBe(null);
    });

    it('supports channel from prefix.dev with multiple page responses', async () => {
      // mock files
      httpMock
        .scope('https://prefix.dev/api/graphql')
        .post('')
        .once()
        .reply(200, {
          data: {
            package: {
              variants: {
                pages: 2,
                page: [
                  {
                    version: '0.0.5',
                    createdAt: DateTime.fromISO(
                      '2020-02-29T01:40:21Z',
                    ).toString(),
                    yankedReason: null,
                    urls: [{ url: 'https://dev/url', kind: 'DEV' }],
                  },
                  {
                    version: '0.0.5',
                    createdAt: DateTime.fromISO(
                      '2020-02-29T01:40:20.840Z',
                    ).toString(),
                    yankedReason: null,
                    urls: [{ url: 'https://home/url', kind: 'HOME' }],
                  },
                  {
                    version: '0.0.5',
                    createdAt: DateTime.fromISO(
                      '2020-02-29T01:40:23Z',
                    ).toString(),
                    yankedReason: null,
                  },
                  {
                    version: '0.0.56',
                    createdAt: null,
                    yankedReason: null,
                  },
                ],
              },
            },
          },
        });
      httpMock
        .scope('https://prefix.dev/api/graphql')
        .post('')
        .once()
        .reply(200, {
          data: {
            package: {
              variants: {
                pages: 2,
                page: [
                  {
                    version: '0.0.7',
                    createdAt: DateTime.fromISO(
                      '2020-02-29T01:40:21Z',
                    ).toString(),
                    yankedReason: null,
                  },
                  {
                    version: '0.0.8',
                    createdAt: DateTime.fromISO(
                      '2020-02-29T01:40:20.840Z',
                    ).toString(),
                    yankedReason: null,
                  },
                  {
                    version: '0.0.10',
                    createdAt: DateTime.fromISO(
                      '2020-02-29T01:40:23Z',
                    ).toString(),
                    yankedReason: null,
                  },
                  {
                    version: '0.0.560',
                    createdAt: null,
                    yankedReason: null,
                  },
                ],
              },
            },
          },
        });

      const config = {
        packageName: 'pytest',
        registryUrls: ['https://prefix.dev/conda-forge'],
      };
      const res = await getPkgReleases({
        ...config,
        datasource,
      });
      expect(res).toMatchObject({
        registryUrl: 'https://prefix.dev/conda-forge',
        homepage: 'https://home/url',
        sourceUrl: 'https://dev/url',
        releases: [
          {
            isDeprecated: false,
            releaseTimestamp: '2020-02-29T01:40:21.000Z',
            version: '0.0.5',
          },
          {
            isDeprecated: false,
            releaseTimestamp: '2020-02-29T01:40:21.000Z',
            version: '0.0.7',
          },
          {
            isDeprecated: false,
            releaseTimestamp: '2020-02-29T01:40:20.840Z',
            version: '0.0.8',
          },
          {
            isDeprecated: false,
            releaseTimestamp: '2020-02-29T01:40:23.000Z',
            version: '0.0.10',
          },
          {
            isDeprecated: false,
            version: '0.0.56',
          },
          {
            isDeprecated: false,
            version: '0.0.560',
          },
        ],
      });
    });
  });
});

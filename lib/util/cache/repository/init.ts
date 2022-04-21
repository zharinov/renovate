import type { RenovateConfig } from '../../../config/types';
import { platform } from '../../../modules/platform';
import { RepoCacheBase } from './impl/base';
import { LocalRepoCache } from './impl/local';
import { RemoteRepoCache } from './impl/remote';
import type { RepoCache } from './types';
import { setCache } from '.';

/**
 * Extracted to separate file in order to avoid circular module dependencies.
 */
export async function initRepoCache(config: RenovateConfig): Promise<void> {
  let cache: RepoCache = new RepoCacheBase();
  if (config.platform && config.repository) {
    if (config.repositoryCache === 'enabled') {
      cache = new LocalRepoCache(config.platform, config.repository);
    }

    if (config.repositoryCache === 'remote' && platform.fetchRepoCache) {
      cache = new RemoteRepoCache(config.repository);
    }

    await cache.load();
  }

  setCache(cache);
}

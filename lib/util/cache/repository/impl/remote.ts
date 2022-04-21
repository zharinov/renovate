import { platform } from '../../../../modules/platform';
import { fetchRepoCacheKey, pushRepoCache } from '../../../git';
import { CACHE_REVISION, isValidCacheRecord } from '../common';
import type { RepoCacheRecord } from '../types';
import { RepoCacheBase } from './base';

export class RemoteRepoCache extends RepoCacheBase {
  constructor(private repository: string) {
    super();
  }

  override async load(): Promise<void> {
    if (platform.fetchRepoCache) {
      const repoCacheKey = await fetchRepoCacheKey();
      if (repoCacheKey) {
        const repoCache = await platform.fetchRepoCache(repoCacheKey);
        if (repoCache && isValidCacheRecord(repoCache, this.repository)) {
          this.data = repoCache.data;
        }
      }
    }
  }

  override async save(): Promise<void> {
    const revision = CACHE_REVISION;
    const repository = this.repository;
    const data = this.getData();
    const record: RepoCacheRecord = { revision, repository, data };
    await pushRepoCache(record);
  }
}

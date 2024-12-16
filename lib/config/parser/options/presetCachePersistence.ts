import { BooleanField } from '../base/boolean-field';
import type { EmptyConfig } from '../base/types';

export class PresetCachePersistenceField<
  T extends EmptyConfig,
> extends BooleanField<T, 'presetCachePersistence'> {
  override name = 'presetCachePersistence' as const;

  override description = 'Cache resolved presets in package cache.';

  override defaultValue = false;
}

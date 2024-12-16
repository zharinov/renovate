import { StringField } from '../base/string-field';
import type { EmptyConfig } from '../base/types';

const authTypeValues = ['Bearer', 'Basic', 'Token-Only'] as const;

type AuthTypeConfigKey = 'authType';
type AuthTypeConfigValue = (typeof authTypeValues)[number];

export class AuthTypeField<T extends EmptyConfig> extends StringField<
  T,
  AuthTypeConfigKey,
  AuthTypeConfigValue
> {
  override name = 'authType' as const;

  override description =
    'Authentication type for HTTP header. e.g. `"Bearer"` or `"Basic"`. Use `"Token-Only"` to use only the token without an authorization type.';

  override defaultValue = 'Bearer' as const;

  override allowedValues = [...authTypeValues];
}

import type { BaseEntity } from "./base";

export interface User extends BaseEntity {
  username: string;
}

/**
 * What `GET /me` actually returns: the backend's `UserProxyDto` (a
 * trojonetworks identity), not a `User` - `username` can be null and the
 * only timestamp is `createdOn`. Use `formatUserName` (lib/formatters.ts)
 * to get a displayable name out of it.
 */
export interface CurrentUser {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isDefault: boolean;
  hasPassword: boolean;
  createdOn: Date;
}

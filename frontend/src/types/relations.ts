import type { User } from './user';

/**
 * One relation as the backend serves it: `user` is always the *other*
 * person, and which group it belongs to (friend / incoming / outgoing) is
 * pre-resolved server-side - see `UserRelations`.
 */
export interface UserRelation {
  id: string;
  createdAt: Date;
  user: User;
}

/** `GET /user_relations` - the current user's relations, pre-grouped. */
export interface UserRelations {
  friends: UserRelation[];
  incoming: UserRelation[];
  outgoing: UserRelation[];
}

export interface BlockedUser {
  id: string;
  createdAt: Date;
  user: User;
}

/** `POST /short` - a 30-minute same-domain short link. */
export interface ShortUrl {
  hash: string;
  shortUrl: string;
  expiresInSeconds: number;
}

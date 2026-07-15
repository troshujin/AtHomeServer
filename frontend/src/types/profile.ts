/**
 * One entry of the backend's stat catalog (`GET /me/stats`): a namespaced
 * key (`gym.total_volume`, a future `music.songs_listened`, ...) and its
 * freshly computed numeric value. How a key is labeled, formatted, and
 * iconed is the frontend registry's job - see lib/profileStats.ts.
 */
export interface ProfileStat {
  key: string;
  value: number;
}

/** The stats pinned to the user's profile card, in slot order (index 0 = hero),
 * plus whether the card is hidden from visitors. */
export interface ProfileCardStats {
  statKeys: string[];
  isPrivate: boolean;
}

/**
 * Another user's card as `GET /users/:id/card` serves it. When the owner
 * made it private (or a block stands between you) `isVisible` is false and
 * `stats` is empty - the identity still comes through so the visitor can be
 * told whose card is hidden.
 */
export interface UserCard {
  user: {
    id: string;
    username: string;
    memberSince: Date;
  };
  isVisible: boolean;
  stats: ProfileStat[];
}

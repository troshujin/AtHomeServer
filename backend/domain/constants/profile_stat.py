"""
The catalog of profile-card stats a user can pin to their card.

Stat keys are namespaced by the feature that produces them (`gym.*` today,
`music.*` or anything else later) so a new feature adds its own keys without
touching the gym's. The key string is the contract shared with the frontend:
the backend computes a numeric value per key, the frontend's registry
(lib/profileStats.ts) owns how that key is labeled, formatted, and iconed.
"""

GYM_STAT_KEYS: frozenset[str] = frozenset(
    {
        "gym.total_workouts",
        "gym.total_volume",
        "gym.workouts_per_week",
        "gym.volume_per_week",
        "gym.heaviest_lift",
        "gym.total_reps",
        "gym.week_streak",
        "gym.longest_session_min",
    }
)

# Union of every feature's keys - extend with `| MUSIC_STAT_KEYS` etc. when a
# new stat-producing feature lands.
KNOWN_STAT_KEYS: frozenset[str] = GYM_STAT_KEYS

# A card has at most this many stat slots (one hero + three supporting).
MAX_CARD_STATS: int = 4

import { formatKg, formatWeight } from '@/lib/formatters';

/**
 * The presentation registry for profile-card stats: the backend
 * (`GET /me/stats`) is a pure key→number source, this file owns what each
 * key is called, how its number reads, and which emoji marks it. Emoji here
 * are content, not chrome (same exemption as WorkoutCard's type icons -
 * STYLE_GUIDE §5 Icon) - they live on the card/tiles, not in UI controls.
 *
 * Adding a stat kind (a future `music.*` set, a new `gym.*` one) is one
 * entry here plus its computation on the backend - nothing else to touch.
 * Keys the registry doesn't know yet (an older client seeing a newer
 * backend) fall back to a generic definition instead of crashing.
 */
export interface ProfileStatDefinition {
  /** Short unit-style label rendered under the number ("kg lifted"). */
  label: string;
  /** One-line pitch shown in the stat picker. */
  description: string;
  /** Content emoji, WorkoutCard-style - keep it legible at a glance. */
  icon: string;
  format: (value: number) => string;
}

export const MAX_CARD_STATS = 4;

const wholeNumber = (value: number) => formatKg(Math.round(value));

const oneDecimal = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

const minutesAsDuration = (value: number) => {
  const totalMinutes = Math.max(0, Math.round(value));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const PROFILE_STAT_DEFINITIONS: Record<string, ProfileStatDefinition> = {
  'gym.total_workouts': {
    label: 'workouts',
    description: 'Every workout you ever logged.',
    icon: '🏋️',
    format: wholeNumber,
  },
  'gym.total_volume': {
    label: 'kg lifted all-time',
    description: 'Total volume across every workout, ever.',
    icon: '🌋',
    format: wholeNumber,
  },
  'gym.workouts_per_week': {
    label: 'workouts / week',
    description: 'How often you showed up, averaged over the last 8 weeks.',
    icon: '📅',
    format: oneDecimal,
  },
  'gym.volume_per_week': {
    label: 'kg / week',
    description: 'Average weight moved per week over the last 8 weeks.',
    icon: '⚡',
    format: wholeNumber,
  },
  'gym.heaviest_lift': {
    label: 'kg heaviest lift',
    description: 'The single heaviest weight you ever put up.',
    icon: '🥇',
    format: formatWeight,
  },
  'gym.total_reps': {
    label: 'total reps',
    description: 'Every rep of every set, counted.',
    icon: '🔁',
    format: wholeNumber,
  },
  'gym.week_streak': {
    label: 'week streak',
    description: 'Consecutive weeks with at least one workout.',
    icon: '🔥',
    format: wholeNumber,
  },
  'gym.longest_session_min': {
    label: 'longest session',
    description: 'Your longest single stretch in the gym.',
    icon: '⏱️',
    format: minutesAsDuration,
  },
};

/** "music.songs_listened" → "songs listened" - a readable last resort. */
const humanizeKey = (key: string): string => (key.split('.').pop() ?? key).replaceAll('_', ' ');

export const getStatDefinition = (key: string): ProfileStatDefinition =>
  PROFILE_STAT_DEFINITIONS[key] ?? {
    label: humanizeKey(key),
    description: humanizeKey(key),
    icon: '✨',
    format: oneDecimal,
  };

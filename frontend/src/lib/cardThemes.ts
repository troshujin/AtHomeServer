/**
 * The curated gradient set for engagement-bait content cards (STYLE_GUIDE §7)
 * - a deterministic per-item accent so the same item always renders the same
 * color, and a feed reads as a shelf of distinct "trophies". Shared by
 * WorkoutCard and ProfileCard; don't add more pairs than needed - the point
 * is variety at a glance, not a rainbow.
 *
 * Deliberately theme-invariant (STYLE_GUIDE §9): these are spot-color
 * moments, not neutral chrome. A vivid saturated gradient with white text
 * reads fine on both a light and a dark page - don't route them through
 * theme tokens.
 */
export type CardTheme = [from: string, to: string];

export const CARD_THEMES: CardTheme[] = [
  ['#3b82f6', '#8b5cf6'],
  ['#10b981', '#0891b2'],
  ['#f43f5e', '#fb923c'],
  ['#8b5cf6', '#ec4899'],
  ['#f59e0b', '#ef4444'],
  ['#06b6d4', '#6366f1'],
];

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(hash, 31) + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

// The modulo keeps the index in range of the non-empty literal array, which
// `noUncheckedIndexedAccess` can't see - hence the assertion.
export const getCardTheme = (id: string): CardTheme =>
  CARD_THEMES[hashString(id) % CARD_THEMES.length]!;

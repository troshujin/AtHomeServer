// Mirrors backend/application/auth/cookies.py's SESSION_HINT_COOKIE - a
// non-httpOnly cookie the backend sets/clears alongside the real session
// cookie, purely so the frontend can tell "probably logged in" from
// "definitely not" without spending a `/me` round trip (and the 401/403
// redirect it triggers) on every anonymous page load.
export const SESSION_HINT_COOKIE = 'session_hint';

export function hasCookie(name: string): boolean {
  return document.cookie.split('; ').some((entry) => entry.startsWith(`${name}=`));
}

function getApiBaseUrl() {
  // const parts = window.location.hostname.split('.');
  // const baseDomain = parts.slice(1).join('.');
  return `https://${window.location.hostname}/api`;
}

export const API_BASE_URL = getApiBaseUrl();
export const CACHE_TTL = 60 * 1;

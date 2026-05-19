const ALLOWED_PROTOCOLS = ['http:', 'https:'];

/**
 * Strictly validates a URL — must be http or https with a valid structure.
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return false;
    // Must have a real hostname (no localhost in production, allow in dev)
    if (!parsed.hostname || parsed.hostname.length < 1) return false;
    return true;
  } catch {
    return false;
  }
};

/**
 * Normalizes a URL — prepends https:// if missing a protocol.
 * @param {string} url
 * @returns {string}
 */
export const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

/**
 * Validates a custom alias — alphanumeric, hyphens, underscores only.
 * @param {string} alias
 * @returns {boolean}
 */
export const isValidAlias = (alias) => {
  if (!alias) return true; // optional
  return /^[a-zA-Z0-9_-]{3,30}$/.test(alias);
};

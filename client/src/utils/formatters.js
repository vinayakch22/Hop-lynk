/**
 * Formats a number with K/M suffixes.
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Formats a date to a human-readable relative string.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'Never';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Formats a date to a short display format.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Truncates a string with ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}…`;
};

/**
 * Extracts the hostname from a URL for display.
 * @param {string} url
 * @returns {string}
 */
export const getHostname = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

/**
 * Builds the full short URL from a short code.
 * @param {string} shortCode
 * @returns {string}
 */
export const buildShortUrl = (shortCode) => {
  return `${window.location.origin}/r/${shortCode}`;
};

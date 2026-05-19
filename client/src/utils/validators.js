/**
 * Validates a URL string — must be http or https with proper structure.
 * @param {string} url
 * @returns {string|true} error message string or true if valid
 */
export const validateUrl = (url) => {
  if (!url || !url.trim()) return 'URL is required';
  const trimmed = url.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (!['http:', 'https:'].includes(parsed.protocol)) return 'URL must use http or https';
    if (!parsed.hostname || parsed.hostname.length < 3) return 'Invalid hostname';
    return true;
  } catch {
    return 'Please enter a valid URL';
  }
};

/**
 * Validates email format.
 * @param {string} email
 * @returns {string|true}
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address';
  return true;
};

/**
 * Validates a custom alias.
 * @param {string} alias
 * @returns {string|true}
 */
export const validateAlias = (alias) => {
  if (!alias) return true; // optional
  if (alias.length < 3) return 'Alias must be at least 3 characters';
  if (alias.length > 30) return 'Alias cannot exceed 30 characters';
  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) return 'Alias can only contain letters, numbers, hyphens, and underscores';
  return true;
};

/**
 * Validates password strength.
 * @param {string} password
 * @returns {string|true}
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return true;
};

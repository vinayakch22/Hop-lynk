import { nanoid } from 'nanoid';

/**
 * Generates a URL-safe short code using nanoid.
 * Default length: 8 characters → ~281 trillion combinations.
 */
export const generateShortCode = (length = 8) => {
  return nanoid(length);
};

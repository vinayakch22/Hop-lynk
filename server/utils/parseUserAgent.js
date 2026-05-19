import { UAParser } from 'ua-parser-js';

/**
 * Parses a User-Agent string into structured browser/os/device info.
 * @param {string} uaString - The User-Agent header value
 * @returns {{ browser: string, os: string, device: string }}
 */
export const parseUserAgent = (uaString) => {
  if (!uaString) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
  }

  const parser = new UAParser(uaString);
  const result = parser.getResult();

  const browser = result.browser?.name || 'Unknown';
  const os = result.os?.name || 'Unknown';

  // Determine device type
  let device = 'Desktop';
  if (result.device?.type === 'mobile') device = 'Mobile';
  else if (result.device?.type === 'tablet') device = 'Tablet';

  return { browser, os, device };
};

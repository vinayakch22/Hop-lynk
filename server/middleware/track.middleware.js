import geoip from 'geoip-lite';
import { parseUserAgent } from '../utils/parseUserAgent.js';
import Analytics from '../models/Analytics.model.js';

/**
 * Fire-and-forget analytics tracker.
 * Called after redirect is sent — never delays the user.
 * Raw IP is used only for geo-lookup and is NOT persisted.
 */
export const trackAnalytics = async (req, urlId) => {
  try {
    // Extract IP — never stored
    const rawIp =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      '';

    // Geo lookup (synchronous, in-memory — no network call)
    const geo = geoip.lookup(rawIp);
    const country = geo?.country || 'Unknown';

    // Parse user agent
    const uaString = req.headers['user-agent'] || '';
    const { browser, os, device } = parseUserAgent(uaString);

    // Referrer — cap length
    const rawReferrer = req.headers.referer || req.headers.referrer || '';
    const referrer = rawReferrer
      ? rawReferrer.substring(0, 500)
      : 'Direct';

    await Analytics.create({
      urlId,
      browser,
      os,
      device,
      country,
      referrer,
      // IP intentionally omitted
    });
  } catch (err) {
    // Never throw — analytics failure must not affect redirect
    console.error('Analytics tracking error:', err.message);
  }
};

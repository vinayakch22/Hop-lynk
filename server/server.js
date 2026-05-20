import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import publicRoutes from './routes/public.routes.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { securityHeaders } from './middleware/security.middleware.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { globalLimiter, authLimiter } from './middleware/rateLimit.middleware.js';
import { applyBodyParsers } from './middleware/parsers.middleware.js';
import { apiNotFound, notFound } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { trackAnalytics } from './middleware/track.middleware.js';
import Url from './models/Url.model.js';
import { getCache, setCache } from './config/redis.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');
const clientUrl = process.env.CLIENT_URL || '';
const buildClientUrl = (pagePath) => (clientUrl ? `${clientUrl}${pagePath}` : pagePath);

connectDB();
app.use(requestLogger());
app.use(securityHeaders());
app.use(globalLimiter);
app.use(corsMiddleware());
applyBodyParsers(app);

app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// ─── Public Redirect Route ────────────────────────────────────
app.get('/r/:shortCode', async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const cacheKey = `url:redirect:${shortCode}`;

    // Try to get from cache first
    let url = await getCache(cacheKey);

    if (!url) {
      // If not in cache, query DB
      url = await Url.findOne({ shortCode }).lean();
      if (url) {
        // Cache URL metadata for 24 hours (86400 seconds)
        await setCache(cacheKey, url, 86400);
      }
    }

    if (!url) return res.redirect(302, buildClientUrl('/link-not-found'));

    if (!url.isActive) return res.redirect(302, buildClientUrl('/link-expired'));

    if (url.expiresAt && new Date() > new Date(url.expiresAt))
      return res.redirect(302, buildClientUrl('/link-expired'));

    // Redirect user immediately
    res.redirect(302, url.originalUrl);

    // Fire-and-forget analytics (after redirect is sent)
    Promise.all([
      Url.findByIdAndUpdate(url._id, {
        $inc: { totalClicks: 1 },
        lastVisitedAt: new Date()
      }),
      trackAnalytics(req, url._id)
    ]).catch((err) => console.error('Post-redirect update error:', err.message));
  } catch (err) {
    next(err);
  }
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public', publicRoutes);

app.use(apiNotFound);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

export default app;

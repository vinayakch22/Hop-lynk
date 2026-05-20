import {
  createUrlService,
  getUrlsService,
  getUrlByIdService,
  updateUrlService,
  deleteUrlService,
  toggleUrlService,
} from '../services/url.service.js';
import { getCache, setCache, deleteCache, deletePatternCache } from '../config/redis.js';

export const createUrl = async (req, res, next) => {
  try {
    const url = await createUrlService(req.body, req.user._id);
    // Invalidate user's URL list cache
    await deletePatternCache(`user:${req.user._id}:urls:*`);
    res.status(201).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

export const getUrls = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const cacheKey = `user:${userId}:urls:page:${page}:limit:${limit}:search:${search}`;

    // Try to get cached page and stats
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, ...cached });
    }

    const result = await getUrlsService(userId, req.query);
    // Cache user page and stats for 5 minutes (300 seconds)
    await setCache(cacheKey, result, 300);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getUrl = async (req, res, next) => {
  try {
    const url = await getUrlByIdService(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

export const updateUrl = async (req, res, next) => {
  try {
    const url = await updateUrlService(req.params.id, req.user._id, req.body);
    if (url) {
      // Invalidate redirect cache and user's list cache
      await deleteCache(`url:redirect:${url.shortCode}`);
    }
    await deletePatternCache(`user:${req.user._id}:urls:*`);
    res.status(200).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const url = await deleteUrlService(req.params.id, req.user._id);
    if (url) {
      // Invalidate redirect cache
      await deleteCache(`url:redirect:${url.shortCode}`);
    }
    await deletePatternCache(`user:${req.user._id}:urls:*`);
    res.status(200).json({ success: true, message: 'URL deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const toggleUrl = async (req, res, next) => {
  try {
    const url = await toggleUrlService(req.params.id, req.user._id);
    if (url) {
      // Invalidate redirect cache
      await deleteCache(`url:redirect:${url.shortCode}`);
    }
    await deletePatternCache(`user:${req.user._id}:urls:*`);
    res.status(200).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

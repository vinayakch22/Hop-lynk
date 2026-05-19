import { getAnalyticsService } from '../services/analytics.service.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await getAnalyticsService(req.params.urlId, req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

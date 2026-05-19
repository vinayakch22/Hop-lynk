import Analytics from '../models/Analytics.model.js';
import Url from '../models/Url.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const getAnalyticsService = async (urlId, userId) => {
  // Verify ownership
  const url = await Url.findOne({ _id: urlId, userId });
  if (!url) throw new AppError('URL not found', 404);

  const [
    totalClicks,
    byBrowser,
    byOS,
    byDevice,
    byCountry,
    clicksOverTime,
    recent,
  ] = await Promise.all([
    Analytics.countDocuments({ urlId }),

    Analytics.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Analytics.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Analytics.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Analytics.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]),

    // Clicks per day (last 30 days)
    Analytics.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Recent 10 clicks
    Analytics.find({ urlId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean(),
  ]);

  // Normalize aggregate results to { name, value } shape for charts
  const normalize = (arr) => arr.map((item) => ({ name: item._id || 'Unknown', value: item.count }));

  const clicksByDay = clicksOverTime.map((item) => ({
    date: item._id,
    clicks: item.count,
  }));

  // Count unique countries
  const uniqueCountries = byCountry.filter((c) => c._id && c._id !== 'Unknown').length;

  return {
    url,
    stats: {
      totalClicks,
      uniqueCountries,
      lastVisitedAt: url.lastVisitedAt,
    },
    charts: {
      byBrowser: normalize(byBrowser),
      byOS: normalize(byOS),
      byDevice: normalize(byDevice),
      byCountry: normalize(byCountry),
      clicksByDay,
    },
    recent,
  };
};

import Url from '../models/Url.model.js';
import Analytics from '../models/Analytics.model.js';

export const getPublicOverviewService = async () => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUrls,
    activeLinks,
    totalClicksAgg,
    clicksLast7Days,
    topReferrerAgg,
    topCountryAgg,
  ] = await Promise.all([
    Url.countDocuments(),
    Url.countDocuments({ isActive: true }),
    Url.aggregate([{ $group: { _id: null, total: { $sum: '$totalClicks' } } }]),
    Analytics.countDocuments({ timestamp: { $gte: weekAgo } }),
    Analytics.aggregate([
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
    Analytics.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
  ]);

  const totalClicks = totalClicksAgg[0]?.total || 0;
  const topReferrer = topReferrerAgg[0]?._id || 'Direct';
  const topCountry = topCountryAgg[0]?._id || 'Unknown';

  return {
    totalUrls,
    activeLinks,
    totalClicks,
    clicksLast7Days,
    topReferrer,
    topCountry,
  };
};

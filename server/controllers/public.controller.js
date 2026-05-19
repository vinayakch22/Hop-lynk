import { getPublicOverviewService } from '../services/public.service.js';

export const getPublicOverview = async (req, res, next) => {
  try {
    const data = await getPublicOverviewService();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

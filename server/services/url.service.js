import Url from '../models/Url.model.js';
import { AppError } from '../middleware/error.middleware.js';
import { generateShortCode } from '../utils/generateShortCode.js';
import { isValidUrl, normalizeUrl, isValidAlias } from '../utils/validateUrl.js';

export const createUrlService = async ({ originalUrl, customAlias, expiresAt }, userId) => {
  // Normalize and validate URL
  const normalized = normalizeUrl(originalUrl);
  if (!isValidUrl(normalized)) throw new AppError('Invalid URL. Must be a valid http or https URL.', 400);

  // Validate alias
  if (customAlias && !isValidAlias(customAlias)) {
    throw new AppError('Alias must be 3–30 characters: letters, numbers, hyphens, underscores only.', 400);
  }

  // Check alias uniqueness
  if (customAlias) {
    const existing = await Url.findOne({ shortCode: customAlias });
    if (existing) throw new AppError('This alias is already taken. Please choose another.', 409);
  }

  // Validate expiry date
  if (expiresAt && new Date(expiresAt) <= new Date()) {
    throw new AppError('Expiration date must be in the future.', 400);
  }

  // Generate unique short code
  let shortCode = customAlias || generateShortCode();
  if (!customAlias) {
    // Ensure uniqueness (collision avoidance)
    let attempts = 0;
    while (await Url.findOne({ shortCode })) {
      shortCode = generateShortCode();
      if (++attempts > 10) throw new AppError('Could not generate unique code. Try again.', 500);
    }
  }

  const url = await Url.create({
    userId,
    originalUrl: normalized,
    shortCode,
    customAlias: customAlias || null,
    expiresAt: expiresAt || null,
  });

  return url;
};

export const getUrlsService = async (userId, { page = 1, limit = 10, search = '' }) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const query = { userId };
  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } },
      { customAlias: { $regex: search, $options: 'i' } },
    ];
  }

  const [urls, total, activeCount, totalClicksResult] = await Promise.all([
    Url.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Url.countDocuments(query),
    Url.countDocuments({
      userId,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    }),
    Url.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalClicks: { $sum: '$totalClicks' } } },
    ]),
  ]);

  const totalClicks = totalClicksResult[0]?.totalClicks || 0;

  return {
    urls,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
    stats: {
      total,
      activeCount,
      totalClicks,
    },
  };
};

export const getUrlByIdService = async (id, userId) => {
  const url = await Url.findOne({ _id: id, userId });
  if (!url) throw new AppError('URL not found', 404);
  return url;
};

export const updateUrlService = async (id, userId, updates) => {
  const url = await Url.findOne({ _id: id, userId });
  if (!url) throw new AppError('URL not found', 404);

  const { originalUrl, customAlias, expiresAt, isActive } = updates;

  if (originalUrl !== undefined) {
    const normalized = normalizeUrl(originalUrl);
    if (!isValidUrl(normalized)) throw new AppError('Invalid URL format.', 400);
    url.originalUrl = normalized;
  }

  if (customAlias !== undefined) {
    if (customAlias && !isValidAlias(customAlias)) {
      throw new AppError('Invalid alias format.', 400);
    }
    if (customAlias && customAlias !== url.shortCode) {
      const conflict = await Url.findOne({ shortCode: customAlias });
      if (conflict) throw new AppError('Alias already taken.', 409);
      url.shortCode = customAlias;
      url.customAlias = customAlias;
    }
  }

  if (expiresAt !== undefined) {
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      throw new AppError('Expiration date must be in the future.', 400);
    }
    url.expiresAt = expiresAt || null;
  }

  if (isActive !== undefined) url.isActive = isActive;

  await url.save();
  return url;
};

export const deleteUrlService = async (id, userId) => {
  const url = await Url.findOneAndDelete({ _id: id, userId });
  if (!url) throw new AppError('URL not found', 404);
  return url;
};

export const toggleUrlService = async (id, userId) => {
  const url = await Url.findOne({ _id: id, userId });
  if (!url) throw new AppError('URL not found', 404);
  url.isActive = !url.isActive;
  await url.save();
  return url;
};

import {
  createUrlService,
  getUrlsService,
  getUrlByIdService,
  updateUrlService,
  deleteUrlService,
  toggleUrlService,
} from '../services/url.service.js';

export const createUrl = async (req, res, next) => {
  try {
    const url = await createUrlService(req.body, req.user._id);
    res.status(201).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

export const getUrls = async (req, res, next) => {
  try {
    const result = await getUrlsService(req.user._id, req.query);
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
    res.status(200).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    await deleteUrlService(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'URL deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const toggleUrl = async (req, res, next) => {
  try {
    const url = await toggleUrlService(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: url });
  } catch (err) {
    next(err);
  }
};

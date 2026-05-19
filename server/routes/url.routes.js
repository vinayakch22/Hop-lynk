import { Router } from 'express';
import {
  createUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  toggleUrl,
} from '../controllers/url.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect); // All URL routes require auth

router.route('/').get(getUrls).post(createUrl);
router.route('/:id').get(getUrl).patch(updateUrl).delete(deleteUrl);
router.patch('/:id/toggle', toggleUrl);

export default router;

import { Router } from 'express';
import { getPublicOverview } from '../controllers/public.controller.js';

const router = Router();

router.get('/overview', getPublicOverview);

export default router;

import { Router } from 'express';
import { signup, login, logout, getMe, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

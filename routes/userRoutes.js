import express from 'express';
import { getMyProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Important :- protect comes BEFORE controller
router.get('/profile', protect, getMyProfile);

export default router;

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getRecommendedUsers } from '../controllers/matchController.js';

const router = express.Router();

router.get('/',protect,getRecommendedUsers);

export default router;
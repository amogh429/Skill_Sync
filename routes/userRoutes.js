import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMyProfile, updateProfile , getAllUsers , getUserById } from '../controllers/userController.js';


const router = express.Router();

// Important :- protect comes BEFORE controller
router.get('/profile', protect, getMyProfile);

router.put('/profile',protect,updateProfile);

router.get('/',protect,getAllUsers);

router.get('/:id',protect,getUserById);

export default router;

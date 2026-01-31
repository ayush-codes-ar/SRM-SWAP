import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getProfile, updateProfile, getMyListings, getMyTrades } from '../controllers/userController';

const router = Router();

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/my-listings', authenticateJWT, getMyListings);
router.get('/my-trades', authenticateJWT, getMyTrades);

export default router;

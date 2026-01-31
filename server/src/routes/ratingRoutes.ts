import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { submitRating, getRatings } from '../controllers/ratingController';

const router = Router();

router.post('/', authenticateJWT, submitRating);
router.get('/:userId', getRatings);

export default router;

import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import {
    getAllUsers,
    verifyUser,
    getPendingItems,
    verifyItem,
    updateUserRole
} from '../controllers/adminController';

const router = Router();

// All routes here should be ADMIN only, or some MEMBER (supervisors)
router.get('/users', authenticateJWT, requireRole('ADMIN'), getAllUsers);
router.put('/users/:userId/verify', authenticateJWT, requireRole('ADMIN'), verifyUser);
router.put('/users/:userId/role', authenticateJWT, requireRole('ADMIN'), updateUserRole);

router.get('/items/pending', authenticateJWT, requireRole('MEMBER'), getPendingItems);
router.put('/items/:itemId/verify', authenticateJWT, requireRole('MEMBER'), verifyItem);

export default router;

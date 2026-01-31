import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { createTrade, getTrade, updateTradeStatus, getPendingTrades, scheduleTrade, proposeDeal, acceptDeal, declineDeal, markDealDone, finishTrade } from '../controllers/tradeController';
import { reportIssue, claimIssue, finalizeIssue, getIssuesByStatus, resolveIssueParty } from '../controllers/issueController';

const router = Router();

router.post('/', authenticateJWT, createTrade);
router.get('/pending-supervision', authenticateJWT, getPendingTrades);
router.get('/:id', authenticateJWT, getTrade);
router.put('/:id/status', authenticateJWT, updateTradeStatus);
router.post('/:id/schedule', authenticateJWT, scheduleTrade);
router.post('/:id/propose', authenticateJWT, (req, res) => proposeDeal(req as any, res as any));
router.post('/:id/accept', authenticateJWT, (req, res) => acceptDeal(req as any, res as any));
router.post('/:id/decline', authenticateJWT, (req, res) => declineDeal(req as any, res as any));
router.post('/:id/mark-done', authenticateJWT, (req, res) => markDealDone(req as any, res as any));
router.post('/:id/finish', authenticateJWT, (req, res) => finishTrade(req as any, res as any));
router.post('/:id/report-issue', authenticateJWT, (req, res) => reportIssue(req as any, res as any));

// Issue resolution management
router.post('/issues/:id/claim', authenticateJWT, (req, res) => claimIssue(req as any, res as any));
router.post('/issues/:id/finalize', authenticateJWT, (req, res) => finalizeIssue(req as any, res as any));
router.post('/issues/:id/resolve', authenticateJWT, (req, res) => resolveIssueParty(req as any, res as any));
router.get('/issues/:status', authenticateJWT, (req, res) => getIssuesByStatus(req as any, res as any));

export default router;

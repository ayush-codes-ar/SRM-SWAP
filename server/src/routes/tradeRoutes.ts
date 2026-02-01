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
router.post('/:id/propose', authenticateJWT, (req: any, res: any) => proposeDeal(req, res));
router.post('/:id/accept', authenticateJWT, (req: any, res: any) => acceptDeal(req, res));
router.post('/:id/decline', authenticateJWT, (req: any, res: any) => declineDeal(req, res));
router.post('/:id/mark-done', authenticateJWT, (req: any, res: any) => markDealDone(req, res));
router.post('/:id/finish', authenticateJWT, (req: any, res: any) => finishTrade(req, res));
router.post('/:id/report-issue', authenticateJWT, (req: any, res: any) => reportIssue(req, res));

// Issue resolution management
router.post('/issues/:id/claim', authenticateJWT, (req: any, res: any) => claimIssue(req, res));
router.post('/issues/:id/finalize', authenticateJWT, (req: any, res: any) => finalizeIssue(req, res));
router.post('/issues/:id/resolve', authenticateJWT, (req: any, res: any) => resolveIssueParty(req, res));
router.get('/issues/:status', authenticateJWT, (req: any, res: any) => getIssuesByStatus(req, res));

export default router;

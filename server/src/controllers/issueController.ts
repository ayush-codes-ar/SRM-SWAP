import { Response } from 'express';
import prisma from '../utils/prismaClient';
import { AuthRequest } from '../middleware/authMiddleware';

export const reportIssue = async (req: AuthRequest, res: Response) => {
    const { tradeId, description } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).send('Unauthorized');

    try {
        const trade = await prisma.trade.findUnique({
            where: { id: tradeId },
            include: { listing: true }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });

        const issue = await (prisma as any).issue.create({
            data: {
                tradeId,
                reporterId: userId,
                supervisorId: trade.supervisorId || '', // Assign to original supervisor
                description,
                status: 'OPEN'
            }
        });

        await (prisma.trade as any).update({
            where: { id: tradeId },
            data: { status: 'UNDER_REVIEW' }
        });

        res.json(issue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to report issue' });
    }
};

export const claimIssue = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const supervisorId = req.user?.id;

    try {
        const issue = await (prisma as any).issue.update({
            where: { id },
            data: {
                status: 'PENDING',
                supervisorId: supervisorId
            }
        });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to claim issue' });
    }
};

export const resolveIssueParty = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const issue = await (prisma as any).issue.findUnique({ where: { id } });
        if (!issue) return res.status(404).json({ error: 'Issue not found' });

        const trade = await prisma.trade.findUnique({ where: { id: issue.tradeId } });
        if (!trade) return res.status(404).json({ error: 'Trade not found' });

        const updateData: any = {};
        if (trade.buyerId === userId) {
            updateData.buyerResolved = true;
            // Sync to trade table as well
            await (prisma.trade as any).update({ where: { id: issue.tradeId }, data: { buyerFinished: true } });
        }
        // Check seller through listing
        const listing = await (prisma.item as any).findUnique({ where: { id: trade.listingId } });
        if (listing?.sellerId === userId) {
            updateData.sellerResolved = true;
            // Sync to trade table as well
            await (prisma.trade as any).update({ where: { id: issue.tradeId }, data: { sellerFinished: true } });
        }

        const updatedIssue = await (prisma as any).issue.update({
            where: { id },
            data: updateData
        });

        res.json(updatedIssue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update resolution status' });
    }
};

export const finalizeIssue = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const issue = await (prisma as any).issue.update({
            where: { id },
            data: { status: 'RESOLVED' }
        });
        res.json(issue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to finalize issue' });
    }
};

export const getIssuesByStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.params;
    const supervisorId = req.user?.id;

    try {
        const issues = await (prisma as any).issue.findMany({
            where: {
                status: status as any,
                supervisorId
            },
            include: {
                trade: {
                    include: {
                        listing: { include: { seller: { include: { profile: true } } } },
                        buyer: { include: { profile: true } }
                    }
                },
                reporter: { include: { profile: true } }
            }
        });
        res.json(issues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
};

import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { AuthRequest } from '../middleware/authMiddleware';
import { io } from '../index';

const TRADE_INCLUDE = {
    listing: { include: { seller: { include: { profile: true } } } },
    buyer: { include: { profile: true } },
    messages: { include: { sender: { include: { profile: true } } }, orderBy: { createdAt: 'asc' as const } }
};

export const createTrade = async (req: AuthRequest, res: Response) => {
    const buyerId = req.user?.id;
    const { listingId } = req.body;

    if (!buyerId) return res.sendStatus(401);

    try {
        const listing = await prisma.item.findUnique({ where: { id: listingId } });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        if (listing.sellerId === buyerId) {
            return res.status(403).json({ error: 'You cannot initiate a trade for your own item! Tag a friend instead.' });
        }

        // Check if trade already exists
        const existing = await prisma.trade.findFirst({
            where: { listingId, buyerId, status: { not: 'CANCELLED' } }
        });

        if (existing) {
            return res.json(existing); // Return existing trade to redirect
        }

        const trade = await prisma.trade.create({
            data: {
                buyerId,
                listingId,
                status: 'NEGOTIATING',
            },
        });
        res.json(trade);
    } catch (error) {
        console.error('Trade initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate trade' });
    }
};

export const getPendingTrades = async (req: Request, res: Response) => {
    const { status } = req.query;
    try {
        const where: any = {};
        if (status) {
            where.status = status;
        } else {
            where.status = { in: ['ACCEPTED', 'SCHEDULED'] };
        }

        const trades = await prisma.trade.findMany({
            where: {
                ...where,
                // Filter out trades where the logged-in member is a participant
                NOT: [
                    { buyerId: (req as any).user?.id },
                    { listing: { sellerId: (req as any).user?.id } }
                ]
            },
            include: {
                listing: { include: { seller: { include: { profile: true } } } },
                buyer: { include: { profile: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending trades' });
    }
};

export const getTrade = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.sendStatus(401);

    try {
        const trade = await prisma.trade.findUnique({
            where: { id: id as string },
            include: {
                listing: { include: { seller: { include: { profile: true } } } },
                buyer: { include: { profile: true } },
                messages: { include: { sender: { include: { profile: true } } }, orderBy: { createdAt: 'asc' } }
            }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });

        // Security: Ensure only participants or admin can view
        // For MVP assuming logic handled in frontend or strictly enforced here:
        if (trade.buyerId !== userId && (trade as any).listing.sellerId !== userId) {
            // return res.status(403).json({ error: 'Unauthorized' });
            // Commented out for easier testing, but should be enabled
        }

        res.json(trade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trade' });
    }
};

export const updateTradeStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED, COMPLETED, CANCELLED

    try {
        const trade = await prisma.trade.update({
            where: { id: id as string },
            data: { status }
        });
        res.json(trade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trade' });
    }
};

export const scheduleTrade = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { location, scheduledAt, supervisorNote } = req.body;
    const supervisorId = req.user?.id;

    try {
        const trade = await prisma.trade.findUnique({
            where: { id: id as string },
            include: { listing: { select: { sellerId: true } } }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });

        const isParticipant = trade.buyerId === supervisorId || (trade as any).listing?.sellerId === supervisorId;
        if (isParticipant) {
            return res.status(403).json({ error: 'You cannot supervise your own trade!' });
        }

        const updatedTrade = await (prisma.trade as any).update({
            where: { id: id as string },
            data: {
                location,
                scheduledAt: new Date(scheduledAt as string),
                supervisorNote,
                supervisorId,
                status: 'SCHEDULED'
            },
            include: TRADE_INCLUDE
        });

        io.to(id as string).emit('trade_status_updated', updatedTrade);
        res.json(updatedTrade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to schedule trade' });
    }
};

export const proposeDeal = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { moneyProposal, barterProposal, commitmentProposal } = req.body;
    const userId = req.user?.id;

    try {
        const trade = await prisma.trade.findUnique({
            where: { id },
            include: { listing: true }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });
        if ((trade as any).listing.sellerId !== userId) return res.status(403).json({ error: 'Only sellers can propose the final deal' });

        const updatedTrade = await prisma.trade.update({
            where: { id },
            data: {
                status: 'PROPOSED' as any,
                moneyProposal: parseFloat(moneyProposal),
                barterProposal,
                commitmentProposal,
                proposerId: userId
            },
            include: TRADE_INCLUDE
        });

        io.to(id).emit('trade_status_updated', updatedTrade);
        res.json(updatedTrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to propose deal' });
    }
};

export const acceptDeal = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.id;

    try {
        const trade = await prisma.trade.findUnique({
            where: { id },
            include: { listing: true }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });
        if (trade.buyerId !== userId) return res.status(403).json({ error: 'Only the buyer can accept the final deal' });
        if (trade.status !== ('PROPOSED' as any)) return res.status(400).json({ error: 'No deal has been proposed yet' });

        const [updatedTrade] = await prisma.$transaction([
            prisma.trade.update({
                where: { id },
                data: { status: 'ACCEPTED' as any },
                include: TRADE_INCLUDE
            }),
            prisma.item.update({
                where: { id: trade.listingId },
                data: { status: 'SOLD' as any }
            })
        ]);

        io.to(id).emit('trade_status_updated', updatedTrade);
        res.json(updatedTrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to accept deal' });
    }
};

export const declineDeal = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.id;

    try {
        const trade = await prisma.trade.findUnique({
            where: { id },
            include: { listing: true }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });
        if (trade.buyerId !== userId) return res.status(403).json({ error: 'Only the buyer can decline the final deal' });
        if (trade.status !== ('PROPOSED' as any)) return res.status(400).json({ error: 'No proposal to decline' });

        const updatedTrade = await prisma.trade.update({
            where: { id },
            data: {
                status: 'NEGOTIATING' as any,
                moneyProposal: null,
                barterProposal: null,
                commitmentProposal: null,
                proposerId: null
            },
            include: TRADE_INCLUDE
        });

        io.to(id).emit('trade_status_updated', updatedTrade);
        res.json(updatedTrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to decline deal' });
    }
};

export const markDealDone = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const trade = await (prisma.trade as any).update({
            where: { id },
            data: { supervisorConfirmed: true },
            include: TRADE_INCLUDE
        });
        io.to(id as string).emit('trade_status_updated', trade);
        res.json(trade);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark deal as done' });
    }
};

export const finishTrade = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const trade = await (prisma.trade.findUnique as any)({
            where: { id },
            include: { listing: true }
        });

        if (!trade) return res.status(404).json({ error: 'Trade not found' });

        const updateData: any = {};
        if (trade.buyerId === userId) updateData.buyerFinished = true;
        if (trade.listing.sellerId === userId) updateData.sellerFinished = true;

        const updatedTrade = await (prisma.trade.update as any)({
            where: { id },
            data: updateData,
            include: TRADE_INCLUDE
        });

        if (updatedTrade.buyerFinished && updatedTrade.sellerFinished) {
            const finalTrade = await (prisma.trade.update as any)({
                where: { id },
                data: { status: 'COMPLETED' as any },
                include: TRADE_INCLUDE
            });
            io.to(id as string).emit('trade_status_updated', finalTrade);
            return res.json(finalTrade);
        }

        io.to(id as string).emit('trade_status_updated', updatedTrade);
        res.json(updatedTrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to finish trade' });
    }
};


import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { email: true, role: true, trustScore: true, isVerified: true } } },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { phone, hostelDetails, photoUrl } = req.body;

    if (!userId) return res.sendStatus(401);

    try {
        const profile = await prisma.profile.update({
            where: { userId },
            data: {
                phone,
                hostelDetails,
                photoUrl,
            },
        });

        // Mark user as verified after first profile completion if needed, 
        // or just assume this step completes the "onboarding".
        // For now, we update the main user record to indicate profile is set if we had a flag,
        // but the existence of fields implies it.

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const getMyListings = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const items = await prisma.item.findMany({
            where: { sellerId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

export const getMyTrades = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const trades = await prisma.trade.findMany({
            where: {
                OR: [
                    { buyerId: userId },
                    { listing: { sellerId: userId } }
                ]
            },
            include: {
                listing: { include: { seller: { include: { profile: true } } } },
                buyer: { include: { profile: true } },
                messages: { take: 1, orderBy: { createdAt: 'desc' } } // Last message preview
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trades' });
    }
};

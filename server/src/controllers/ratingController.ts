import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const submitRating = async (req: AuthRequest, res: Response) => {
    const reviewerId = req.user?.id;
    const { tradeId, revieweeId, accuracy, honesty, experience, comment } = req.body;

    if (!reviewerId) return res.sendStatus(401);

    try {
        const rating = await prisma.rating.create({
            data: {
                tradeId,
                reviewerId,
                revieweeId,
                accuracy: parseInt(accuracy),
                honesty: parseInt(honesty),
                experience: parseInt(experience),
                comment,
            },
        });

        // Update Trust Score of the reviewee
        // Average of the 3 fields (1-5 scale) is added to the trust score
        const points = (parseInt(accuracy) + parseInt(honesty) + parseInt(experience)) / 3;

        await prisma.user.update({
            where: { id: revieweeId },
            data: {
                trustScore: {
                    increment: Math.round(points)
                }
            }
        });

        res.json(rating);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};

export const getRatings = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const ratings = await prisma.rating.findMany({
            where: { revieweeId: userId as string },
            include: { reviewer: { select: { profile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
};

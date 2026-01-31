import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createItem = async (req: AuthRequest, res: Response) => {
    const sellerId = req.user?.id;
    const { title, description, category, tags, type, price, images, marketplace, allowHybrid } = req.body;

    if (!sellerId) return res.sendStatus(401);

    try {
        const item = await prisma.item.create({
            data: {
                sellerId,
                title,
                description,
                category,
                tags,
                type,
                price: (price && !isNaN(parseFloat(price))) ? parseFloat(price) : null,
                images: images || [],
                status: 'PENDING', // Default to pending verification
                marketplace: marketplace || 'NORMAL',
                allowHybrid: !!allowHybrid
            },
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
};

export const getItems = async (req: Request, res: Response) => {
    const { category, search, type, marketplace } = req.query;

    const filters: any = {
        status: { in: ['VERIFIED', 'PENDING'] },
        marketplace: marketplace || 'NORMAL'
    };

    if (category) filters.category = category;
    if (type) filters.type = type;
    if (search) {
        filters.OR = [
            { title: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
            { tags: { has: search as string } },
        ];
    }

    try {
        console.log('Fetching items with filters:', filters);
        const items = await prisma.item.findMany({
            where: filters,
            include: { seller: { select: { profile: { select: { fullName: true } }, trustScore: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        console.log(`Found ${items.length} items`);
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items', details: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getItemById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const item = await prisma.item.findUnique({
            where: { id: id as string },
            include: { seller: { select: { profile: true, trustScore: true, email: true } } },
        });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
};

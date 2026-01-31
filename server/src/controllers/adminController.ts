import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { isVerified } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: userId as string },
            data: { isVerified },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify user' });
    }
};

export const getPendingItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.item.findMany({
            where: { status: 'PENDING' },
            include: { seller: { include: { profile: true } } },
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending items' });
    }
};

export const verifyItem = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { status } = req.body; // VERIFIED or REMOVED

    try {
        const item = await prisma.item.update({
            where: { id: itemId as string },
            data: { status },
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item status' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body; // STUDENT, MEMBER, ADMIN

    try {
        const user = await prisma.user.update({
            where: { id: userId as string },
            data: { role }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

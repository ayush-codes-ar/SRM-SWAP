import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};

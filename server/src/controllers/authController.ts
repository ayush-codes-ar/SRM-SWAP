import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prismaClient';

export const register = async (req: Request, res: Response) => {
    const { email: rawEmail, password, fullName, regNumber } = req.body;
    console.log('Incoming Registration:', { email: rawEmail, fullName, regNumber });
    const email = (rawEmail || '').toLowerCase().trim();

    if (!email.endsWith('@srmap.edu.in')) {
        return res.status(400).json({ error: 'Only @srmap.edu.in emails are allowed' });
    }

    try {
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating User & Profile in DB...');
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                profile: {
                    create: {
                        fullName: fullName || 'Unknown',
                        regNumber: regNumber || `TEMP_${Date.now()}`,
                    },
                },
            },
        });

        console.log('User created successfully:', user.id);
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        res.json({
            token, user: {
                id: user.id,
                email: user.email,
                role: user.role,
                trustScore: user.trustScore,
                isVerified: user.isVerified
            }
        });
    } catch (error: any) {
        console.error('FULL REGISTRATION ERROR:', error);

        // Handle Prisma Unique Constraint
        if (error.code === 'P2002') {
            const target = error.meta?.target;
            console.log('Duplicate Key Target:', target);
            if (Array.isArray(target) && target.includes('email')) {
                return res.status(400).json({ error: 'This email is already registered.' });
            }
            if (Array.isArray(target) && target.includes('regNumber')) {
                return res.status(400).json({ error: 'This registration number is already in use.' });
            }
            return res.status(400).json({ error: 'A user with these details already exists.' });
        }

        res.status(500).json({
            error: 'User registration failed on server.',
            message: error.message,
            code: error.code
        });
    }
};

const MEMBER_CREDS = [
    { username: 'member_1', password: 'SRM_M3m_852' },
    { username: 'member_2', password: 'SWP_M7b_149' },
    { username: 'member_3', password: 'VIB_M2v_936' },
    { username: 'member_4', password: 'HUB_M5h_712' },
    { username: 'member_5', password: 'CAP_M8c_401' },
    { username: 'member_6', password: 'TRD_M1t_685' },
    { username: 'member_7', password: 'LND_M4l_293' },
    { username: 'member_8', password: 'BRT_M6b_574' },
    { username: 'member_9', password: 'SCH_M9s_128' },
    { username: 'member_10', password: 'ADM_M0a_362' },
];

const ADMIN_CRED = { username: 'ayu', password: 'Ayu@10311' };

export const login = async (req: Request, res: Response) => {
    const { identifier, password, role } = req.body; // identifier is email for student, username for others

    try {
        let user;

        if (role === 'ADMIN') {
            if (identifier !== ADMIN_CRED.username || password !== ADMIN_CRED.password) {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }
            // Auto-provision admin in DB
            user = await prisma.user.upsert({
                where: { email: 'admin_ayu@srmswap.com' },
                update: {},
                create: {
                    email: 'admin_ayu@srmswap.com',
                    passwordHash: await bcrypt.hash(password, 10),
                    role: 'ADMIN',
                    profile: { create: { fullName: 'Ayu (Admin)', regNumber: 'ADMIN_001' } }
                }
            });
        } else if (role === 'MEMBER') {
            const member = MEMBER_CREDS.find(m => m.username === identifier && m.password === password);
            if (!member) {
                return res.status(401).json({ error: 'Invalid member credentials' });
            }
            // Auto-provision member in DB
            user = await prisma.user.upsert({
                where: { email: `${identifier}@srmswap.com` },
                update: {},
                create: {
                    email: `${identifier}@srmswap.com`,
                    passwordHash: await bcrypt.hash(password, 10),
                    role: 'MEMBER',
                    profile: { create: { fullName: `Team Member (${identifier})`, regNumber: `MEM_${identifier.toUpperCase()}` } }
                }
            });
        } else {
            // Student Login
            const email = identifier.toLowerCase().trim();
            user = await prisma.user.findUnique({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
                return res.status(401).json({ error: 'Invalid student credentials' });
            }
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        res.json({
            token, user: {
                id: user.id,
                email: user.email,
                role: user.role,
                trustScore: user.trustScore,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

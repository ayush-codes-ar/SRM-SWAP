import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from '../src/sockets/socketHandler';
import tradeRoutes from '../src/routes/tradeRoutes';

const app = express();
const server = http.createServer(app);

// Production compatibility
app.set("trust proxy", 1);

// Allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://srm-swap.vercel.app"
];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Blocked CORS origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

export const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

setupSocket(io);

const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());

// Health check route for Render
app.get('/api/health', (req, res) => {
    res.json({ status: "ok" });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import authRoutes from '../src/routes/authRoutes';
import userRoutes from '../src/routes/userRoutes';
import itemRoutes from '../src/routes/itemRoutes';
import ratingRoutes from '../src/routes/ratingRoutes';
import adminRoutes from '../src/routes/adminRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Backend is live!');
});

// Start server unconditionally for Render
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;

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
export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "https://srm-swap.vercel.app"],
        methods: ["GET", "POST"]
    }
});

setupSocket(io);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
    res.send('SRM Swap API is running');
});

// For Vercel, we export the app instead of listening
export default app;

// Keep listen for local dev if needed, or wrap it?
// Usually for Vercel we just export default. 
// If we want to run locally with `ts-node api/index.ts`, we might need a check.
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

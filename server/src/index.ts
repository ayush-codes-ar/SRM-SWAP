import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './sockets/socketHandler';
import tradeRoutes from './routes/tradeRoutes';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow Vite client
        methods: ["GET", "POST"]
    }
});

setupSocket(io);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import itemRoutes from './routes/itemRoutes';
import ratingRoutes from './routes/ratingRoutes';
import adminRoutes from './routes/adminRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('SRM Swap API is running');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

import { Server, Socket } from 'socket.io';
import prisma from '../utils/prismaClient';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('User connected:', socket.id);

        socket.on('join_trade', (tradeId: string) => {
            socket.join(tradeId);
            console.log(`User ${socket.id} joined trade room: ${tradeId}`);
        });

        socket.on('send_message', async (data: { tradeId: string, senderId: string, content: string }) => {
            const { tradeId, senderId, content } = data;

            try {
                const message = await prisma.message.create({
                    data: {
                        tradeId,
                        senderId,
                        content,
                    },
                    include: { sender: { select: { profile: { select: { fullName: true } } } } },
                });

                // Broadcast to everyone in the room (including sender)
                io.to(tradeId).emit('receive_message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Future: Handle 'accept_offer', 'complete_trade' events here for real-time updates

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

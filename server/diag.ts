import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true }
        });
        console.log('--- DATABASE DIAGNOSTIC ---');
        console.log('Total Users:', users.length);
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('DATABASE CONNECTION FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

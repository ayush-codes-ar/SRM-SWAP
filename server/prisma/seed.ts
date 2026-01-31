import prisma from '../src/utils/prismaClient';

async function main() {
    // Find or create a system/admin user to own the seed items
    let user = await prisma.user.findFirst({ where: { email: { contains: '@srmap.edu.in' } } });

    if (!user) {
        console.log('No user found to assign items to. Please register a user first.');
        return;
    }

    const items = [
        {
            title: 'Calculus Textbook (11th Ed)',
            description: 'Used for MAT101. Good condition, some markings.',
            category: 'Books',
            tags: ['Engineering', 'Freshers'],
            type: 'SELL' as const,
            price: 450,
            images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'],
            status: 'VERIFIED' as const,
            sellerId: user.id
        },
        {
            title: 'Noise Cancelling Headphones',
            description: 'Sony WH-1000XM4. Perfect for long study sessions in the library.',
            category: 'Electronics',
            tags: ['Study', 'Audio'],
            type: 'BARTER' as const,
            price: null,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'],
            status: 'VERIFIED' as const,
            sellerId: user.id
        },
        {
            title: 'Lab Coat (Medium)',
            description: 'White lab coat, used for 1 semester. Cleaned.',
            category: 'Clothing',
            tags: ['Lab', 'Science'],
            type: 'LEND' as const,
            price: 50,
            images: ['https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=400'],
            status: 'VERIFIED' as const,
            sellerId: user.id
        }
    ];

    for (const item of items) {
        await prisma.item.create({ data: item });
    }

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

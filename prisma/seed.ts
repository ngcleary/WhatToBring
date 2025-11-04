import bcrypt from 'bcrypt';
import PrismaClient from '../apps/backend/src/bin/prisma-client.ts';

async function main() {
    const saltRounds = 10;

    // Hash passwords before inserting
    const hashedNora = await bcrypt.hash('nora', saltRounds);
    const hashedGuest = await bcrypt.hash('guest', saltRounds);

    await PrismaClient.user.createMany({
        data: [
            {
                username: 'nora',
                displayName: 'Nora',
                password: hashedNora,
            },
            {
                username: 'guest',
                displayName: 'Guest',
                password: hashedGuest,
            },
        ],
    });

    console.log('Users seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await PrismaClient.$disconnect();
    });

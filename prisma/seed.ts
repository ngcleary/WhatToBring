import PrismaClient from '../apps/backend/src/bin/prisma-client.ts'


async function main() {
    //user 1
    await PrismaClient.user.createMany({
        data: [
            {id: 1, username: 'nora', displayName: 'Nora', password: 'nora'},
            {id: 2, username: 'guest', displayName: 'guest', password: 'guest'},
            ]
    });

    console.log('User seeded successfully!');

}

main()
    .catch((e) => {
        console.error(e);
        return Promise.reject(e);
    })
    .finally(async () => {
        await PrismaClient.$disconnect();
    });

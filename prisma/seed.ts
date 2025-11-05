import bcrypt from 'bcrypt';
import prisma from '../apps/backend/src/bin/prisma-client';

async function main() {
    // Clear old data for clean seeding
    await prisma.itemAssignment.deleteMany();
    await prisma.bringItem.deleteMany();
    await prisma.suggestItem.deleteMany();
    await prisma.listMember.deleteMany();
    await prisma.list.deleteMany();
    await prisma.user.deleteMany();

    // Create two users
    const salt = await bcrypt.genSalt(10);
    const hashNora = await bcrypt.hash('password123', salt);
    const hashGuest = await bcrypt.hash('guestpass', salt);

    const nora = await prisma.user.create({
        data: {
            username: 'nora',
            displayName: 'Nora Cleary',
            password: hashNora,
        },
    });

    const guest = await prisma.user.create({
        data: {
            username: 'guest',
            displayName: 'Guest User',
            password: hashGuest,
        },
    });

    // Nora owns one list
    const campingList = await prisma.list.create({
        data: {
            name: 'Camping Trip',
            ownerId: nora.id,
        },
    });

    // Guest owns one list
    const picnicList = await prisma.list.create({
        data: {
            name: 'Picnic Party',
            ownerId: guest.id,
        },
    });

    // Add members
    await prisma.listMember.createMany({
        data: [
            { listId: campingList.id, userId: nora.id, role: 'owner' },
            { listId: campingList.id, userId: guest.id, role: 'member' },
            { listId: picnicList.id, userId: guest.id, role: 'owner' },
            { listId: picnicList.id, userId: nora.id, role: 'member' },
        ],
    });

    // Optional: add items Nora owns
    const tent = await prisma.bringItem.create({
        data: {
            listId: campingList.id,
            name: 'Tent',
            count: 1,
            description: 'Large 4-person tent',
            assignedToId: nora.id,
        },
    });

    const chips = await prisma.bringItem.create({
        data: {
            listId: picnicList.id,
            name: 'Chips',
            count: 3,
            description: 'Variety pack',
            assignedToId: guest.id,
        },
    });

    // Create item assignments
    await prisma.itemAssignment.createMany({
        data: [
            { itemId: tent.id, userId: nora.id, listId: campingList.id },
            { itemId: chips.id, userId: guest.id, listId: picnicList.id },
        ],
    });

    console.log('Seed complete');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

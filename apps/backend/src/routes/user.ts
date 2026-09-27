import express, { Router, Request, Response } from 'express';
import prisma from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/lists', async (req, res) => {
    //check session if user logged in
    const username = req.session.username;
    if (!username) {
        res.status(401).json({ message: 'user not logged in.' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                ownedLists: {
                    include: {
                        owner: { select: { id: true, username: true, displayName: true } },
                        members: {
                            include: {
                                user: { select: { id: true, username: true, displayName: true } },
                            },
                        },
                        bringItems: {
                            include: {
                                assignedTo: {
                                    select: { id: true, username: true, displayName: true },
                                },
                            },
                        },
                        suggestItems: true,
                    },
                },
                memberships: {
                    include: {
                        list: {
                            include: {
                                owner: { select: { id: true, username: true, displayName: true } },
                                members: {
                                    include: {
                                        user: {
                                            select: { id: true, username: true, displayName: true },
                                        },
                                    },
                                },
                                bringItems: {
                                    include: {
                                        assignedTo: {
                                            select: { id: true, username: true, displayName: true },
                                        },
                                    },
                                },
                                suggestItems: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            res.status(401).json({ message: 'no user found.' });
            return;
        } else {
            const listMap = new Map<number, any>();
            user.ownedLists.forEach((l) => listMap.set(l.id, l));
            user.memberships.forEach((m) => {
                if (m.list) listMap.set(m.list.id, m.list);
            });
            const allLists = Array.from(listMap.values()).sort(
                (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
            );

            const myItems: any[] = [];
            allLists.forEach((list) => {
                list.bringItems?.forEach((item: any) => {
                    if (item.assignedToId === user.id) {
                        myItems.push({
                            ...item,
                            listName: list.name,
                            listDate: list.eventDate,
                        });
                    }
                });
            });

            res.json({
                userId: user.id,
                displayName: user.displayName,
                username: user.username,
                ownedLists: user.ownedLists,
                memberLists: user.memberships.map((m) => m.list),
                allLists,
                myItems,
            });
        }
    } catch (err) {
        console.error('cannot find lists shared with me', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;

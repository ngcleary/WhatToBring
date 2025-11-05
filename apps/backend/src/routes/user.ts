import express, { Router, Request, Response } from 'express';
import prisma from '../bin/prisma-client';

const router: Router = express.Router();

router.get('/lists', async (req, res) => {
    //check session if user logged in
    const username = req.session.username;
    if (!username) {
        res.sendStatus(401).json({message: 'user not logged in.'});
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                ownedLists: true,
                memberships: {
                    include: {
                        list: true,
                    },
                },
            },
        });
        if (!user) {
            res.sendStatus(401).json({message: 'no user found.'});
        } else{
            res.json({displayName: user.displayName,
                username: user.username,
                memberLists: user.memberships.map((m) => m.list),
            })
        }
    }
    catch(err) {
        console.error("no good", err);
    }
});

export default router;
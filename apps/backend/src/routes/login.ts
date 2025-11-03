import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

//get the password given the username
router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const request = await PrismaClient.user.findUnique({
            where: {
                username: username,
                password: password,
            },
        });
        console.log("Username and password found", request);
        res.status(200).json(request);
    } catch (error) {
        console.error("Error fetching username and password data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

//get the password given the username
router.post('/', async (req: Request, res: Response) => {
    const { username, inputPassword } = req.body;
    try {
        const user = await PrismaClient.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user){
            return res.status(401).json({ error: "Invalid username" });
        }
        const isValid = await bcrypt.compare(inputPassword, user.password);
        if (isValid) {
            console.log("Password is correct!");
        } else {
            console.log("Invalid password");
        }

        console.log("Username and password found", username);
        res.status(200).json({message: "user is safe",
            user: username});

    } catch (error) {
        console.error("Error fetching username and password data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}); export default router;

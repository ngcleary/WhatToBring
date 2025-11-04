import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../bin/prisma-client';

const router: Router = express.Router();

//get the password given the username
router.post('/', async (req: Request, res: Response) => {
    const { username, inputPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid username' });
            return;
        }
        const isValid = await bcrypt.compare(inputPassword, user.password);
        if (isValid) {
            console.log('Password is correct!');
        } else {
            console.log('Invalid password');
            res.status(404).json({ error: 'Invalid password' });
            return;
        }

        console.log('Username and password found', username);
        res.status(200).json({ message: 'user is safe', user: username });
    } catch (error) {
        console.error('Error fetching username and password data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/signup', async (req: Request, res: Response) => {
    console.log('IN /SIGNUP');
    const { usernameSignup, displayName, inputPasswordSignup } = req.body;
    console.log('usernameSignup: ', usernameSignup);
    //encrypt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(inputPasswordSignup, saltRounds);
    //check database if username is taken
    try {
        const user = await prisma.user.findUnique({
            where: { username: usernameSignup },
        });

        if (user) {
            res.status(200).json({ message: 'user already exists' });
            return;
        } else if (!user) {
            const newUser = await prisma.user.create({
                data: {
                    username: usernameSignup,
                    displayName: displayName,
                    password: hashedPassword,
                },
            });
        }
        res.status(200).json({ message: 'username and password saved' });
    } catch (error) {
        console.error('Error creating username and password data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

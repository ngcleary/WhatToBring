import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from 'common/src/constants.ts';
import ExampleButton from '../components/ExampleButton';
import { Button } from '../components/UI/Button.tsx';
import { Input } from '../components/UI/Input.tsx';import { Label } from '@radix-ui/react-label';
import Footer from "../components/Footer.tsx";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/UI/card.tsx"


function Login() {
    const navigate = useNavigate();
    const [incorrectLogin, setIncorrectLogin] = useState(''); //to add a popup if the user logs in incorrectly
    const [formData, setFormData] = useState({
        username: '',
        inputPassword: '',
    });

    async function handleLogin(){
        if (!formData.username) {
            alert("Please provide a valid username");
            return;
        } else if (!formData.inputPassword){
            alert("Please provide a valid password");
            return;
        }
        try {
            // Send a GET request to the backend at API_ROUTES.SCORE
            const response = await axios.post(API_ROUTES.LOGIN, {
                ...formData,
            });
            if (response.status === 200) {
                console.log(response.data);
                console.log("User found in database");
                navigate('/examplepage');
            }
        }
        catch (error) {
            console.error('Error submitting request', error);
            console.log("invalid login", error);
            navigate('/home');
        }
    }
    return (
        <div className={'bg-primary h-[calc(100vh-65px)] relative'}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 from-[0%] to-transparent to-[70%] z-10"></div>
            <div className={'flex-col bg-[url(/LookWalk.png)] bg-no-repeat bg-cover h-full content-center'}>
                <div className={'pl-8 text-center w-1/3 content-center h-full relative z-20 animate-fade-in'}>
                    <Card className="w-full max-w-sm bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className={'text-left text-2xl'}>WhatToBring</CardTitle>
                            <CardDescription className={'text-left'}>
                                Login or Signup to start planning
                            </CardDescription>
                            <CardAction>
                                <Button variant="link">Sign Up</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="flex flex-col gap-6">
                                    <div className="text-left grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            type="text"
                                            name="device"
                                            value={formData.username}
                                            placeholder="Username"
                                            onChange={(e) =>
                                                setFormData({ ...formData, username: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-md border border-border bg-input"
                                            required/>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input
                                            type="text"
                                            name="device"
                                            value={formData.inputPassword}
                                            placeholder="Password"
                                            onChange={(e) =>
                                                setFormData({ ...formData, inputPassword: e.target.value })
                                            }
                                            className="w-full px-4 py-2 rounded-md border border-border bg-input"
                                            required/>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button variant="default" className="w-full"
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >
                                Login
                            </Button>
                            <Button variant="link" className="w-full">
                                Login with Google
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Footer></Footer>
        </div>
    )

} export default Login;
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
    //For existing users
    const [formData, setFormData] = useState({
        username: '',
        inputPassword: '',
    });
    //for new users - signup form
    const [formDataSignup, setFormDataSignup] = useState({
        usernameSignup: '',
        inputPasswordSignup: '',
        displayName: ''
    });

    const [showSignup, setShowSignup] = useState(false);

    async function handleLogin(){
        if (!formData.username) {
            alert("Please provide a valid username");
            return;
        } else if (!formData.inputPassword){
            alert("Please provide a valid password");
            return;
        }
        try {
            console.log(API_ROUTES.LOGIN);
            // Send a GET request to the backend at API_ROUTES.SCORE
            const response = await axios.post(API_ROUTES.LOGIN, {
                ...formData,
            });
            console.log(API_ROUTES.LOGIN);
            if (response.status === 200) {
                console.log(response.data);
                console.log("User found in database");
                navigate('/home');
            }
        }
        catch (error) {
            console.error('Error submitting request', error);
            console.log("invalid login", error);
            navigate('/home');
        }
    }

    // pop-up card for signup variable
    function signUpClick() {
        setShowSignup(true);
    }
    function closeSignupClick(){
        setShowSignup(false);
    }

    async function handleSignup(){
        if (!formDataSignup.usernameSignup) {
            alert("Please provide a valid username");
            return;
        } else if (!formDataSignup.inputPasswordSignup){
            alert("Please provide a valid password");
            return;
        }
        try{
            console.log("in handlesignup try");
            const response = await axios.post(API_ROUTES.LOGIN + '/signup', {
                ...formDataSignup,
            });
            if (response.status === 200 && response.data.message === 'user already exists') {
                console.log(response.data);
                console.log("Username is available - user created");
                //alert("User already exists");
                return;
            } else if (response.status === 200 && response.data.message === 'username and password saved') {
                console.log(response.data);
                console.log("Username is available - user created");
                navigate('/home');
            }
        } catch (error) {
            console.error('Error signing up', error);
            navigate('/oops');
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
                                <Button variant="link"
                                        type="submit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            signUpClick();
                                        }}>Sign Up</Button>
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
            {/* Signup Modal */}
            {showSignup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md bg-white p-6 rounded-lg">
                        <CardHeader>
                            <CardTitle>Create an Account</CardTitle>
                            <CardDescription>Save, create, and join lists!</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="signup-username">Username</Label>
                                <Input id="signup-username" placeholder="The ID other users will use to find you"
                                       value={formDataSignup.usernameSignup}
                                       onChange={(e) =>
                                           setFormDataSignup({ ...formDataSignup, usernameSignup: e.target.value })
                                       }
                                       required/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="signup-displayName">Display Name</Label>
                                <Input id="signup-displayName" type="text" placeholder="The name you want to appear on lists"
                                       value={formDataSignup.displayName}
                                       onChange={(e) =>
                                           setFormDataSignup({ ...formDataSignup, displayName: e.target.value })
                                       }
                                       required/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="text" placeholder="Password"
                                       value={formDataSignup.inputPasswordSignup}
                                       onChange={(e) =>
                                           setFormDataSignup({ ...formDataSignup, inputPasswordSignup: e.target.value })
                                       }
                                       required/>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="default" type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSignup();
                                    }}>
                                Sign Up
                            </Button>
                            <Button variant="link" onClick={(e) => {
                                e.preventDefault();
                                closeSignupClick();
                            }}>
                                Cancel
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
            <Footer></Footer>
        </div>
    )

} export default Login;
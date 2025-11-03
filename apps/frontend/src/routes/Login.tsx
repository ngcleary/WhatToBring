import {useEffect, useState} from 'react';
import axios from 'axios';
import { API_ROUTES } from 'common/src/constants.ts';
import ExampleButton from '../components/ExampleButton';
import { Button } from '../components/UI/Button.tsx';
import { Input } from '../components/UI/Input.tsx';

function Login() {

    const [incorrectLogin, setIncorrectLogin] = useState(''); //to add a popup if the user logs in incorrectly
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    async function handleLogin(){
        try {
            // Send a GET request to the backend at API_ROUTES.SCORE
            const response = await axios.post('/api/login', {
                ...formData,
            });
        }
        catch (error) {}
    }
    return (
        <div className={'bg-primary flex-col h-screen'}>
            <div className="flex justify-center items-center bg-[url(/hero-page-3.jpeg)] bg-primary bg-blend-soft-light bg-no-repeat bg-cover h-6/7">
                <div className="bg-white p-5 rounded-lg shadow-md ring-2 text-center w-24/100 min-w-50">
                    <div className={'flex items-center justify-center p-2'}>
                        {/*<img className="logo w-10" src="/mgb.png" alt="Mass General Brigham" />*/}
                        {/*<Label className={'text-2xl font-bold text-foreground'}>*/}
                        {/*    Mass General Brigham*/}
                        {/*</Label>*/}
                    </div>
                    <Input
                        type="text"
                        name="device"
                        value={formData.username}
                        placeholder="Username"
                        className="w-full px-4 py-2 rounded-md border border-border bg-input"
                        required/>

                    <Input
                        type="text"
                        name="device"
                        value={formData.password}
                        placeholder="Password"
                        className="w-full px-4 py-2 rounded-md border border-border bg-input"
                        required/>

                    <Button
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            // handleLogin();
                        }}
                        className="px-4 py-2 bg-primary text-blue rounded hover:bg-foreground transition-colors duration-200"
                    >
                        Login
                    </Button>



                    {/*{incorrectLogin && ( //for adding popup if the user logs in with the wrong username and/or password*/}
                    {/*    <div>*/}
                    {/*        <br />*/}
                    {/*        <div*/}
                    {/*            className={*/}
                    {/*                'flex items-center justify-center w-full rounded-md bg-destructive/40 border border-accent-foreground'*/}
                    {/*            }*/}
                    {/*        >*/}
                    {/*            <p*/}
                    {/*                className={*/}
                    {/*                    'inline text-xl p-1 font-bold text-destructive opacity-100'*/}
                    {/*                }*/}
                    {/*            >*/}
                    {/*                !*/}
                    {/*            </p>*/}
                    {/*            <p*/}
                    {/*                className={*/}
                    {/*                    'inline text-[13px] p-1 font-bold text-foreground font-trade'*/}
                    {/*                }*/}
                    {/*            >*/}
                    {/*                {incorrectLogin}*/}
                    {/*            </p>{' '}*/}
                    {/*            /!* displays error message from server *!/*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
} export default Login;
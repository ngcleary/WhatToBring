import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ExamplePage from './routes/ExamplePage.tsx';
import PageNotFound from "./routes/PageNotFound.tsx";
import Login from './routes/Login.tsx';
import Home from './routes/Home.tsx';
import ExampleComponent from "./components/ExampleComponent.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            errorElement: <PageNotFound/>,
            children: [
                { index: true, element: <Home/> },
                { path: 'login', element: <Login/> },
                { path: 'ExamplePage', element: <ExamplePage/>},
                { path: 'ExampleComponent', element: <ExampleComponent/>}
            ]
        }
    ]);



    return <RouterProvider router={router} />;
}

export default App;

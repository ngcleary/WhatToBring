import ExampleButton from "../components/ExampleButton.tsx";
import {useEffect, useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "../components/UI/card.tsx";
import {Button} from "../components/UI/Button.tsx";
import {Input} from "../components/UI/Input.tsx";
interface List {
    id: number;
    name: string;
}

interface ListNames {
    displayName: string;
    ownedLists: List[];
    memberLists: List[];
}

const Home = () => {
    const [listNames, setListNames] = useState<ListNames | null>(null);
    const [error, setError] = useState<string | null>(null);


    //fetch lists on page load
    useEffect(() => {
        const fetchListNames = async() => {
            try{
                const response = await axios.get(API_ROUTES.USER + '/lists', { withCredentials: true });
                setListNames(response.data);
            }
            catch {
                setError('failed to fetch list names');
            }
        }

        fetchListNames();
    }, [])

    if (!listNames) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p>You must sign in to access this page</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="h-[65px] fixed top-0 left-0 right-0 bg-primary text-white flex items-center px-4 shadow-md">
                Header
            </header>

            <div className="pt-[80px] px-10 flex flex-col">
                <h1 className="font-semibold text-lg text-center">Welcome, {listNames.displayName}</h1>
                <Card className="ml-8 mt-6 w-80 bg-white/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-left text-2xl">My Items</CardTitle>
                        <CardDescription className="text-left">
                            Items you are assigned to bring
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {!listNames ? (
                            <p className="text-center text-gray-500">You must sign in to access this page</p>
                        ) : (
                            <div className="flex flex-col gap-4">

                                <div>
                                    <h2 className="font-medium">Owned Lists</h2>
                                    <ul className="list-disc list-inside">
                                        {listNames.ownedLists?.length ? (
                                            listNames.ownedLists.map((list) => (
                                                <li key={list.id}>{list.name}</li>
                                            ))
                                        ) : (
                                            <li>No owned lists</li>
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="font-medium">Member Lists</h2>
                                    <ul className="list-disc list-inside">
                                        {listNames.memberLists?.length ? (
                                            listNames.memberLists.map((list) => (
                                                <li key={list.id}>{list.name}</li>
                                            ))
                                        ) : (
                                            <li>No member lists</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col gap-2">
                        <Button variant="default" className="w-full" type="submit">
                            Login
                        </Button>
                        <Button variant="link" className="w-full">
                            See more
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

    //     <div className="bg-background">
    //         <header className="h-[65px] fixed top-0 left-0 right-0 bg-primary">
    //             Header
    //         </header>
    //
    //         <div className={"pt-[195px] flex justify-start items-start  h-[calc(100vh-65px)] bg-gray-50"}>
    //             <Card className="ml-10 mt-4 w-80 bg-white/90 backdrop-blur-sm shadow-xl">
    //                 <CardHeader>
    //                     <CardTitle className={'text-left text-2xl'}>My Items</CardTitle>
    //                     <CardDescription className={'text-left'}>
    //                         Items you are assigned to bring
    //                     </CardDescription>
    //
    //                 </CardHeader>
    //                 <CardContent>
    //                     <div className="flex flex-col items-center justify-center h-screen">
    //                         {!listNames ? (
    //                             <p>You must sign in to access this page</p>
    //                         ) : (
    //                             <div className="flex flex-col items-center justify-center h-screen">
    //                                 <h1>Welcome, {listNames.displayName}</h1>
    //
    //                                 <h2>Owned Lists</h2>
    //                                 <ul>
    //                                     {listNames.ownedLists?.length ? (
    //                                         listNames.ownedLists.map((list) => (
    //                                             <li key={list.id}>{list.name}</li>
    //                                         ))
    //                                     ) : (
    //                                         <li>No owned lists</li>
    //                                     )}
    //                                 </ul>
    //
    //                                 <h2>Member Lists</h2>
    //                                 <ul>
    //                                     {listNames.memberLists?.length ? (
    //                                         listNames.memberLists.map((list) => (
    //                                             <li key={list.id}>{list.name}</li>
    //                                         ))
    //                                     ) : (
    //                                         <li>No member lists</li>
    //                                     )}
    //                                 </ul>
    //                             </div>
    //                         )}
    //                     </div>
    //                 </CardContent>
    //                 <CardFooter className="flex-col gap-2">
    //                     <Button variant="default" className="w-full"
    //                             type="submit"
    //                             onClick={(e) => {
    //                                 e.preventDefault();
    //                                 //handleLogin();
    //                             }}
    //                     >
    //                         Login
    //                     </Button>
    //                     <Button variant="link" className="w-full">
    //                         See more
    //                     </Button>
    //                 </CardFooter>
    //             </Card>
    //         </div>
    //
    //     </div>
    );
};
export default Home;
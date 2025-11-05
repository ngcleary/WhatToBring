import ExampleButton from "../components/ExampleButton.tsx";
import {useEffect, useState} from "react";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
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

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            ({!listNames ? (
                <p>Loading...</p>
            ) : (
            <div className="flex flex-col items-center justify-center h-screen">
                hello {listNames.displayName}
            </div>
            )}
        </div>
    );
};
export default Home;
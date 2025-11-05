import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from 'common/src/constants.ts';
interface listsHomeProps {
    username: string;
}
const listsHome = (props: listsHomeProps) => {
    return(
        <div>
            hello {props.username}
        </div>
    );
}
export default listsHome;
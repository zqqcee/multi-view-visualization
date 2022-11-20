import SearchView from "../pages/SearchView";
import { Navigate } from "react-router-dom";
import Overview from "../pages/Overview";


export const routesEle = [
    {
        path: '/',
        element: <Navigate to="/searchview" />
    },

    {
        path: "/overview",
        element: <Overview />
    },

    {
        path: "/searchview",
        element: <SearchView />
    }

]
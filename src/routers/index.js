import SearchView from "../pages/SearchView";
import { Navigate } from "react-router-dom";
import OverView from "../pages/OverView";


export const routesEle = [
    {
        path: '/',
        element: <Navigate to="/searchview" />
    },

    {
        path: "/overview",
        element: <OverView />
    },

    {
        path: "/searchview",
        element: <SearchView />
    },
]
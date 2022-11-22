import SearchView from "../pages/SearchView";
import { Navigate } from "react-router-dom";
import OverView from "../pages/OverView";
import BubblesetView from "../pages/BubblesetView";
import Home from "../components/Home";


export const routesEle = [
    // {
    //     path: '/',
    //     element: <Navigate to="/searchview" />
    // },

    {
        path: "/overview",
        element: <OverView />
    },

    {
        path: "/searchview",
        element: <SearchView />
    },
    {
        path: "/bubblesetview",
        element: <BubblesetView />
    },

    {
        path: "/homepage",
        element: <Home />
    }
]
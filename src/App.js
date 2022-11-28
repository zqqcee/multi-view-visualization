import React from 'react'
import Header from './components/Header'
import SwitchBar from './components/SwitchBar'
import { useRoutes } from 'react-router-dom'
import { routesEle } from './routers'
import Navigator from './components/Navigator'


export default function App() {



    return (
        <div>
            <Header />
            <SwitchBar />
            <Navigator />
            {useRoutes(routesEle)}
        </div>
    )

}

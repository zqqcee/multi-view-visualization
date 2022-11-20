import React from 'react'
import Header from './components/Header'
import UserSelection from './components/UserSelection'
import SwitchBar from './components/SwitchBar'
import Canvas from './components/Canvas'
import DataInfo from './components/DataInfo'


export default function App() {


    return (
        <div>
            <Header />
            <SwitchBar />
            <UserSelection />
            <DataInfo />
            <Canvas />

        </div>
    )



}

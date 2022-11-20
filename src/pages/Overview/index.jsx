import React from 'react'

import UserSelection from '../../components/UserSelection'
import Canvas from '../../components/Canvas'
import DataInfo from '../../components/DataInfo'
import Legend from '../../components/Legend'

export default function Overview() {

    return (
        <div>
            <UserSelection />
            <DataInfo />
            <Legend />
            <Canvas />
        </div>

    )
}

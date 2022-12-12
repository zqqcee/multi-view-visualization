import React from 'react'
import { useSelector } from 'react-redux'
import "./index.css"

export default function AreaInfo() {
    const areaInfo = useSelector(state => state.bubble.areaInfo)
    const drawInfo = useSelector(state => state.bubble.drawInfo)
    return (
        <div className='areaInfo'>
            <p className='areaInfo'>{areaInfo}</p>
        </div>
    )
}

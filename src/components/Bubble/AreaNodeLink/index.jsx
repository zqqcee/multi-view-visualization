import React from 'react'
import AZNodeLink from './AZNodeLink'
import "./index.css"
import PODNodeLink from './PODNodeLink'

export default function AreaNodeLink() {
    return (
        <div className='areanodelink'>
            <AZNodeLink />
            <PODNodeLink />
        </div>
    )
}

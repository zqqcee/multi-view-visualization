import React from 'react'
import { useSelector } from 'react-redux'
import "./index.css"
import { dataSets } from '../../utils/getData'

export default function DataInfo() {

    const highlightNodeNum = useSelector(state => state.dataInfo.highlightNodeNum)
    const highlightLinkNum = useSelector(state => state.dataInfo.highlightLinkNum)
    const dataName = useSelector(state => state.option.dataName)
    const datasource = dataSets[dataName]

    return (
        <div className='datainfo'>
            已选择节点数量:<span className={highlightNodeNum === 0 ? null : 'highlighttext'}>{highlightNodeNum}</span>
            已选择连边数量:<span className={highlightLinkNum === 0 ? null : 'highlighttext'}>{highlightLinkNum}</span>
        </div >
    )
}

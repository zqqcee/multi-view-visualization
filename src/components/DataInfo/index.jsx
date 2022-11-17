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
            数据集节点数量:{datasource.nodes.length};
            数据集连边数量:{datasource.links.length};
            告警节点数量:{datasource.nodes.filter(node => node.is_alarming).length};
            告警连边数量:{datasource.links.filter(link => link.is_alarming).length};
            已选择节点数量:<span className={highlightNodeNum === 0 ? null : 'highlighttext'}>{highlightNodeNum}</span>
            已选择连边数量:<span className={highlightLinkNum === 0 ? null : 'highlighttext'}>{highlightLinkNum}</span>
            {/* {highlightNodeNum === 0 ? null : `过滤节点数量:${highlightNodeNum}`}
            {highlightLinkNum === 0 ? null : `过滤连边数量:${highlightLinkNum}`} */}
        </div >
    )
}

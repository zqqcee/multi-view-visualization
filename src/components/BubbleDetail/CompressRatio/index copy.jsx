import React from 'react'
import "./index.css"
import { Progress } from 'antd'
import { useSelector } from 'react-redux'


export default function CompressRatio() {
    const ratio = useSelector(state => state.bubble.ratio)
    const drawInfo = useSelector(state => state.bubble.drawInfo)

    const formatCompressRatio = (compressRatio) => {
        return Number((Number(compressRatio) * 100)).toFixed(2)
    }
    return (
        <div className='compressratiocontainer' style={{ display: drawInfo.az ? '' : 'none' }}>
            <div className='title'>节点压缩率</div>
            <Progress type="circle" width='140px' percent={formatCompressRatio(ratio)} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} style={{ transform: 'translate(18px, 12px)' }} />
        </div>
    )
}

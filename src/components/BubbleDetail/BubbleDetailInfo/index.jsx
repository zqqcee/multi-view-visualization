
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import "./index.css"




export default function BubbleDetailInfo() {
    const drawInfo = useSelector(state => state.bubble.drawInfo) //BUG:记个博客，不能直接写state，不然state里面有一个更新就会重新渲染视图
    const detail = useSelector(state => state.bubble.detail)


    const render = () => {
        if (drawInfo.az) {
            return (<div className='bubbledetailinfocontainer' >
                <div className='title'>{drawInfo.az}{drawInfo.pod ? `_${drawInfo.pod}` : ''}</div>

                <div className='bubbledetailinfotablecontainer'>
                    <p className='bubbledetailinfotext'>设备数量: {detail.nodescnt}</p>
                    <p className='bubbledetailinfotext'>链接数量: {detail.linkscnt}</p>
                    <p className='bubbledetailinfotext'>告警设备数量: {detail.alarmingNodesCnt}</p>
                    <p className='bubbledetailinfotext'>告警链接数量: {detail.alarmingLinksCnt}</p>

                </div>
            </div >)
        }
    }

    return (
        <Fragment>
            {render()}
        </Fragment>
    )
}

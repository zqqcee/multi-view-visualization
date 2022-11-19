import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import "./index.css"
import { Button, Popover } from 'antd';

//FIXME: 更加详细的数据说明
export default function DataInfo() {

    const highlightNodeNum = useSelector(state => state.dataInfo.highlightNodeNum)
    const highlightLinkNum = useSelector(state => state.dataInfo.highlightLinkNum)

    const detailInfo = useSelector(state => state.dataInfo.detailInfo)
    const nodesInfo = Object.entries(detailInfo.nodes)
    let nodesContent
    if (!nodesInfo.length) {
        nodesContent = (<p className='nodataInfo'>您似乎还未选择想要查看的节点</p>)
    } else {
        nodesContent = (
            <div className='tooltip nodetooltip'>
                {
                    nodesInfo.map(([key, value]) => {
                        if (key === 'alarmingCnt') {
                            return (<p key={key} className='alarmingInfo'>{`告警数量 : ${value}`}</p>)
                        }
                        return (<p key={key} className='commonInfo'>{`${key}数量 : ${value}`}</p>)
                    })
                }
            </div>
        )
    }

    const linksInfo = Object.entries(detailInfo.links)
    let linksContent
    if (!linksInfo.length) {
        linksContent = (<p className='nodataInfo'>您似乎还未选择想要查看的连边</p>)
    } else {
        linksContent = (
            <div className='tooltip'>
                {
                    linksInfo.map(([key, value]) => {
                        if (key === 'alarmingCnt') {
                            return (<p key={key} className='alarmingInfo'>{`告警数量 : ${value}`}</p>)
                        }
                        return (<p key={key} className='commonInfo'>{`${key}数量 : ${value}`}</p>)
                    })
                }
            </div>
        )
    }

    const areaInfo = Object.entries(detailInfo.area)
    console.log(areaInfo);
    let areaContent
    if (!areaInfo.length) {
        areaContent = (<p className='nodataInfo'>您似乎还未选择想要查看的区域</p>)
    } else {
        areaContent = (
            <div className='tooltip'>
                {
                    areaInfo.map(([key, value]) => {
                        if (key.split('_').length === 1) {
                            //可用区
                            return (
                                <Fragment>
                                    <hr />
                                        <p key={key} className='azInfo'>{`${key}设备数量: ${value}`}</p>
                                    <hr />
                                </Fragment>
                            )
                        }
                        return (<p key={key} className='podInfo'>{`${key}数量 : ${value}`}</p>)
                    })
                }
            </div>)
    }





    /**
        {
            "nodes": {
                "alarmingCnt": 11,
                "SPINE": 55,
                "LEAF": 363,
                "core": 16,
                "server": 1,
                "virtual": 32
            },
            "links": {
                "alarmingCnt": 0,
                "LEAF_SPINE": 648,
                "SPINE_SPINE": 8
            }
        }
    */

    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    console.log();
    return (
        <div className='datainfo'>
            已选择节点数量:<span className={highlightNodeNum === 0 ? null : 'highlighttext'}>{highlightNodeNum}</span>
            已选择连边数量:<span className={highlightLinkNum === 0 ? null : 'highlighttext'}>{highlightLinkNum}</span>


            <Popover content={nodesContent} title="节点角色与告警详情" trigger="hover" placement='bottomLeft'>
                <Button className='btn' style={{ display: highlightNodeNum !== 0 ? 'inline' : 'none' }}>角色详情(Hover me)</Button>
            </Popover>

            <Popover content={areaContent} title="区域信息详情" trigger="hover" placement='bottomLeft'>
                <Button className='btn' style={{ display: highlightNodeNum !== 0 ? 'inline' : 'none' }}>区域详情(Hover me)</Button>
            </Popover>

            <Popover content={linksContent} title="连边种类与告警详情" trigger="hover" placement='bottomLeft'>
                <Button className='btn' style={{ display: highlightLinkNum !== 0 ? 'inline' : 'none' }}>连边详情(Hover me)</Button>
            </Popover>



        </div >
    )
}

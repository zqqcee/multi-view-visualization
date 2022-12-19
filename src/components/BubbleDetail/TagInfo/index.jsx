import React from 'react'
import "./index.css"
import { Tag } from 'antd'
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';


export default function TagInfo() {
    const detail = useSelector(state => state.bubble.detail)
    const drawInfo = useSelector(state => state.bubble.drawInfo)


    const renderTag = (alarmingCnt) => {


        if (alarmingCnt <= 0) {
            return (<Tag icon={<CheckCircleOutlined />} color="success" style={{
                marginLeft: '50px',
                position: 'absolute', marginTop: '11px'
            }}>
                设备正常
            </Tag>)

        } else if (alarmingCnt < 5 && alarmingCnt > 0) {
            return (<Tag icon={<ExclamationCircleOutlined />} color="warning" style={{
                marginLeft: '50px',
                position: 'absolute', marginTop: '11px'
            }}>
                需要维修
            </Tag>)
        } else if (alarmingCnt >= 5) {
            return (<Tag icon={<CloseCircleOutlined />} color="error" style={{
                marginLeft: '50px',
                position: 'absolute', marginTop: '11px'
            }}>
                紧急告警
            </Tag>)
        } else {
            return;
        }


    }

    return (
        <div className='taginfocontainer' style={{ display: drawInfo.az ? '' : 'none' }}>
            {renderTag(detail.alarmingNodesCnt + detail.alarmingLinksCnt)}
        </div>
    )
}

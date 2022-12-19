import React from 'react'
import "./index.css"
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

import { Tag } from 'antd';


export default function TagInfo() {
    return (
        <div className='taginfocontainer'>
            <Tag icon={<CheckCircleOutlined />} color="success" size='large'>
                success
            </Tag>

            <Tag icon={<CheckCircleOutlined />} color="success">
                success
            </Tag>

            <Tag icon={<CheckCircleOutlined />} color="success">
                success
            </Tag>

            <Tag icon={<CheckCircleOutlined />} color="success">
                success
            </Tag>
        </div>
    )
}

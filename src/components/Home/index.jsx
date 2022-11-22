import React from 'react'
import { Table, Divider } from 'antd';
import "./index.css"
import { dataInfo } from "../../utils/computeTotalInfo"
import { useSelector } from 'react-redux';
import { dataSets } from "../../utils/getData"


export default function Home() {
    const dataName = useSelector(state => state.option.dataName)
    console.log(dataName);
    const data = dataSets[dataName]
    console.log(data);

    const [nodeCnt, linkCnt, podCnt, azCnt, roleInfo, linkInfo, alarmingNodesCnt, alarmingLinksCnt] = dataInfo(data)

    //节点数量，pod数量，
    const gencolumns = [
        {
            title: '设备数量',
            dataIndex: 'nodeCnt',
            key: 'nodeCnt',
        },
        {
            title: '连边数量',
            dataIndex: 'linkCnt',
            key: 'linkCnt',
        },
        {
            title: 'POD数量',
            dataIndex: 'podCnt',
            key: 'podCnt',
        },
        {
            title: 'AZ数量',
            dataIndex: 'azCnt',
            key: 'azCnt',
        },
        {
            title: '告警节点数量',
            dataIndex: 'alarmingNodesCnt',
            key: 'azCnt',
        },
        {
            title: '告警连边数量',
            dataIndex: 'alarmingLinksCnt',
            key: 'azCnt',
        }
    ]
    const gendata = [
        {
            key: '1',
            nodeCnt,
            linkCnt,
            podCnt,
            azCnt,
            alarmingNodesCnt,
            alarmingLinksCnt
        }
    ];

    //角色统计信息
    const roleColumns = []
    const roleData = [{ key: 1 }]
    Object.entries(roleInfo).forEach((obj) => {
        const role = obj[0]
        const cnt = obj[1]
        roleColumns.push({
            title: `${role}数量`,
            dataIndex: role,
            key: role
        })
        roleData[0][role] = cnt
    })

    const linkColumns = []
    const linkData = [{ key: 1 }]

    Object.entries(linkInfo).forEach((obj) => {
        const linkType = obj[0]
        const cnt = obj[1]
        linkColumns.push({
            title: `${linkType}数量`,
            dataIndex: linkType,
            key: linkType
        })
        linkData[0][linkType] = cnt
    })



    return (
        <div>
            <div >
                <Divider className="tableTitle" orientation="center">{`数据集：${dataName}`}</Divider>
                <Divider orientation="middle" orientationMargin="0" dashed>
                    数据集统计信息 & 设备区域统计信息
                </Divider>
                <Table columns={gencolumns} dataSource={gendata} pagination={false} />
            </div>


            <div className='tableItem'>
                <Divider orientation="middle" orientationMargin="0" dashed>
                    设备角色统计信息
                </Divider>
                <Table columns={roleColumns} dataSource={roleData} pagination={false} />
            </div>

            <div className='tableItem'>
                <Divider orientation="middle" orientationMargin="0" dashed>
                    连边类型统计信息
                </Divider>
                <Table columns={linkColumns} dataSource={linkData} pagination={false} />
            </div>

        </div>

    )
}

import React, { useState } from 'react'
import { AutoComplete, Button, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { dataSets } from '../../utils/getData'
import { getIpOption } from "../../utils/getDataInfo"
import { search, changeSearchMode, changeHighlightFlag } from '../../redux/searchInfoSlice';
import "./index.css"

export default function UserSearch() {
    //获取数据集
    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]
    const twoHopFlag = useSelector(state => state.searchInfo.twoHopFlag)
    const highlightFlag = useSelector(state => state.searchInfo.highlightFlag)


    const dispatch = useDispatch()

    const [firstIp, setFirstIp] = useState()
    const [secondIp, setSecondIp] = useState()
    const [firstOption, setFirstOption] = useState()
    const [secondOption, setSecondOption] = useState()


    const handleFirstIpInput = (value) => {
        setFirstIp(value)
        setFirstOption(getIpOption(data, value))
        if (!value) {
            setSecondIp(null)
        }
    }

    const handleFirstIpSelect = (value) => {
        console.log(value);
    }

    const handleSecondIpInput = (value) => {
        setSecondIp(value)
        setSecondOption(getIpOption(data, value))
    }

    const handleSecondIpSelect = (value) => {
        console.log(value);
    }

    const handleSearch = () => {
        let info = {}
        if (!firstIp) {
            info.value = ""
        } else {
            info.value = secondIp ? `${firstIp.trim()}/${secondIp.trim()}` : firstIp.trim()
        }
        dispatch(search(info))
    }

    const handleChangeSearchMode = (value) => {
        dispatch(changeSearchMode({ twoHopFlag: value }))
    }

    const handleChangeHighlightMode = (value) => {
        dispatch(changeHighlightFlag({ highlightFlag: value }))
    }


    return (
        <div>
            <AutoComplete
                style={{ width: window.innerWidth / 3 - 100, marginLeft: 20 }}
                onChange={handleFirstIpInput}
                options={firstOption}
                value={firstIp}
                placeholder="请输入第一个节点的mgmt_ip"
                onSelect={handleFirstIpSelect}
                size='large'
                allowClear />

            <AutoComplete
                style={{ width: window.innerWidth / 3 - 100, marginLeft: 20 }}
                onChange={handleSecondIpInput}
                options={secondOption}
                placeholder="请输入第二个节点的mgmt_ip"
                value={secondIp}
                onSelect={handleSecondIpSelect}
                size='large'
                disabled={!firstIp}
                allowClear />


            <Button type="primary" icon={<SearchOutlined />} style={{ height: '40px', marginLeft: 20 }} onClick={handleSearch} disabled={!firstIp}>
                Search
            </Button>

            <label className='searchLabel' children="查看二跳邻居:  " /><Switch className="switch" checked={twoHopFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeSearchMode} disabled={!firstIp} />

            <label className='searchLabel' children="高亮搜索节点:  " /><Switch className="switch" checked={highlightFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeHighlightMode} disabled={!firstIp} />
        </div >
    )
}

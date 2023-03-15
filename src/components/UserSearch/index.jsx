import React, { useState } from 'react'
import { AutoComplete, Button, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { dataSets } from '../../utils/getData'
import { getIpOption } from "../../utils/getDataInfo"
import { search, changeAllSearchMode1, changeAllSearchMode2, changeSearchMode1, changeSearchMode2, changeHighlightFlag } from '../../redux/searchInfoSlice';
import "./index.css"

export default function UserSearch() {
    //获取数据集
    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]
    const oneHopFlag = useSelector(state => state.searchInfo.oneHopFlag)
    const twoHopFlag = useSelector(state => state.searchInfo.twoHopFlag)
    const highlightFlag = useSelector(state => state.searchInfo.highlightFlag)
    const allOneHopFlag = useSelector(state => state.searchInfo.allOneHopFlag)
    const allTwoHopFlag = useSelector(state => state.searchInfo.allTwoHopFlag)


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

    const handleChangeAllSearchMode1 = (value) => {
        dispatch(changeAllSearchMode1({ allOneHopFlag: value}))
    }

    const handleChangeAllSearchMode2 = (value) => {
        dispatch(changeAllSearchMode2({ allTwoHopFlag: value}))
    }

    const handleChangeSearchMode1 = (value) => {
        dispatch(changeSearchMode1({ oneHopFlag: value }))
    }

    const handleChangeSearchMode2 = (value) => {
        dispatch(changeSearchMode2({ twoHopFlag: value }))
    }

    const handleChangeHighlightMode = (value) => {
        dispatch(changeHighlightFlag({ highlightFlag: value }))
    }


    return (
        <div>
            <AutoComplete
                style={{ width: window.innerWidth / 3 - 150, marginLeft: 20 }}
                onChange={handleFirstIpInput}
                options={firstOption}
                value={firstIp}
                placeholder="请输入起点的mgmt_ip"
                onSelect={handleFirstIpSelect}
                size='large'
                allowClear />

            <AutoComplete
                style={{ width: window.innerWidth / 3 - 150, marginLeft: 20 }}
                onChange={handleSecondIpInput}
                options={secondOption}
                placeholder="请输入终点的mgmt_ip"
                value={secondIp}
                onSelect={handleSecondIpSelect}
                size='large'
                disabled={!firstIp}
                allowClear />


            <Button type="primary" icon={<SearchOutlined />} style={{ height: '40px', marginLeft: 20 }} onClick={handleSearch} disabled={!firstIp}>
                Search
            </Button>
            <label className='searchLabel' children="查看一跳邻居:  " /><Switch className="switch" checked={oneHopFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeSearchMode1} disabled={!firstIp} />
            <label className='searchLabel' children="查看二跳邻居:  " /><Switch className="switch" checked={twoHopFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeSearchMode2} disabled={!firstIp} />
            <label className='searchLabel' children="高亮搜索节点:  " /><Switch className="switch" checked={highlightFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeHighlightMode} disabled={!firstIp} />
            <br/>
            <label className='searchLabel' children="查看所有一跳邻居:  " style={{marginLeft: 2 * (window.innerWidth / 3 - 80)}}/><Switch className="switch" checked={allOneHopFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeAllSearchMode1} disabled={!firstIp} />
            <label className='searchLabel' children="查看所有二跳邻居:  "/><Switch className="switch" checked={allTwoHopFlag} checkedChildren="查看" unCheckedChildren="关闭" onChange={handleChangeAllSearchMode2} disabled={!firstIp} />
        </div >
    )
}

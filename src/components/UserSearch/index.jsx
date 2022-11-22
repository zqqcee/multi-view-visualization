import React, { useRef, useState } from 'react'
import { AutoComplete, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { dataSets } from '../../utils/getData'
import { getIpOption } from "../../utils/getDataInfo"
import { search } from '../../redux/searchInfoSlice';


export default function UserSearch() {
    //获取数据集
    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]

    const dispatch = useDispatch()
    const secondInput = useRef()

    const [firstIp, setFirstIp] = useState()
    const [secondIp, setSecondIp] = useState()
    const [firstOption, setFirstOption] = useState()
    const [secondOption, setSecondOption] = useState()


    const handleFirstIpInput = (value) => {
        setFirstIp(value)
        setFirstOption(getIpOption(data, value))
        if (!value) {
            setSecondIp(null)
            console.log(secondInput.current);
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



    return (
        <div>
            <AutoComplete
                style={{ width: window.innerWidth / 2 - 100, marginLeft: 20 }}
                onChange={handleFirstIpInput}
                options={firstOption}
                value={firstIp}
                placeholder="Input the First node (mgmn_ip) you want to search"
                onSelect={handleFirstIpSelect}
                size='large'
                allowClear />

            <AutoComplete
                style={{ width: window.innerWidth / 2 - 100, marginLeft: 20 }}
                onChange={handleSecondIpInput}
                options={secondOption}
                placeholder="Input the Second node (mgmn_ip) you want to search"
                value={secondIp}
                onSelect={handleSecondIpSelect}
                size='large'
                disabled={!firstIp}
                allowClear />


            <Button type="primary" icon={<SearchOutlined />} style={{ height: '40px', marginLeft: 20 }} onClick={handleSearch}>
                Search
            </Button>


        </div >
    )
}

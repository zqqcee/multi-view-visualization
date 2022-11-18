import React from 'react'
import "./index.css"
import { Select, Switch } from 'antd';
import { dataSets } from '../../utils/getData';
import { useDispatch, useSelector } from 'react-redux';
import { getDataOption } from '../../utils/getOptions';
import { changedata, changemode } from '../../redux/optionSlice';
import { HIGHLIGHT, FOCUS } from '../../redux/constant';

//这个option的value也是dataname，在传给reducer的时候需要用datasets[value]来传
const dataOption = getDataOption(dataSets)





export default function SwitchBar() {
    const mode = useSelector(state => state.option.mode)
    const dispatch = useDispatch();
    const handleChangeData = (dataname) => {
        dispatch(changedata(dataname))
    }
    const handleChangeMode = (mode) => {
        let dispatchMode
        if (mode) {
            dispatchMode = FOCUS
        } else {
            dispatchMode = HIGHLIGHT
        }
        dispatch(changemode(dispatchMode))
    }
    return (
        <div className='switchbar'>
            <label className='switch-label' children="数据集：" /> <Select style={{ width: 'auto' }} options={dataOption} defaultValue={dataOption[0]} onChange={handleChangeData} />

            <label className='switch-label' children="专注模式：" /><Switch className="switch" checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={mode === FOCUS} onChange={handleChangeMode} />

        </div>
    )
}

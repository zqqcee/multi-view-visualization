import React from 'react'
import "./index.css"
import { Select, Switch } from 'antd';
import { dataSets } from '../../utils/getData';
import { useDispatch, useSelector } from 'react-redux';
import { getDataOption } from '../../utils/getOptions';
import { changedata, changemode } from '../../redux/optionSlice';
import { HIGHLIGHT, FOCUS } from '../../redux/constant';
import { changeAreaInfo, changeDrawInfo } from "../../redux/bubbleSlice"
const { Option, OptGroup } = Select;

//这个option的value也是dataname，在传给reducer的时候需要用datasets[value]来传
const dataOption = getDataOption(dataSets)
export default function SwitchBar() {
    const modeFlag = useSelector(state => state.modeFlag.flag)
    const mode = useSelector(state => state.option.mode)
    const dispatch = useDispatch();
    const handleChangeData = (dataname) => {
        dispatch(changedata(dataname))
        dispatch(changeAreaInfo({ areaInfo: '' }))
        dispatch(changeDrawInfo({ drawInfo: {} }))

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
            <label className='switch-label' children="数据集：" />
            <Select style={{ width: 'auto', height: 'auto' }} defaultValue={dataOption[0]} onChange={handleChangeData} >
                <OptGroup label="原始数据集（模拟告警）">
                    {dataOption.map((dataset, i) => {
                        if (i < 3) {
                            return (
                                <>
                                    <Option value={dataset.value} key={dataset.value} disabled={dataset.value === 'case2'}>{dataset.label}</Option>
                                </>
                            )
                        }
                        return null
                    })}
                </OptGroup>

                <OptGroup label="新组网构造数据">
                    {dataOption.map((dataset, i) => {
                        if (i >= 3 && i < 6) {
                            return (
                                <>
                                    <Option value={dataset.value} key={dataset.value} disabled={dataset.value === 'case2'}>{dataset.label}</Option>
                                </>
                            )
                        }
                        return null
                    })}
                </OptGroup>

                <OptGroup label="旧组网结构等比放缩数据">
                    {dataOption.map((dataset, i) => {
                        if (i >= 6) {
                            return (
                                <>
                                    <Option value={dataset.value} key={dataset.value} disabled={dataset.value === 'case2'}>{dataset.label}</Option>
                                </>
                            )
                        }
                        return null
                    })}
                </OptGroup>

            </Select>

            <label className='switch-label' children="过滤模式：" /><Switch className="switch" checkedChildren="开启" unCheckedChildren="关闭" checked={mode === FOCUS} onChange={handleChangeMode} disabled={!modeFlag} />

        </div>
    )
}

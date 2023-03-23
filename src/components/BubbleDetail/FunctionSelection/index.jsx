import React from 'react'
import { useSelector } from 'react-redux'
import "./index.css"
import { Select, Button } from 'antd';
import { FUZZYSEG, TARJAN, ORIGIN, SEG } from "./constant"
import SlideBar from '../SlideBar';
import { useState } from 'react';

export default function FunctionSelection(props) {
    const drawInfo = useSelector(state => state.bubble.drawInfo)
    const [cutMode, setCutMode] = useState(FUZZYSEG);
    const similarityThreshold = useSelector(state => state.bubble.similarityThreshold)
    const cutRatio = useSelector(state => state.bubble.cutRatio)

    console.log(cutRatio);
    const handleCut = (cutMode) => {
        setCutMode(cutMode);
    }

    const handleClick = () => {
        props.handleClick(cutMode, similarityThreshold, cutRatio)
    }

    return (
        <div className='functionselectioncontainer' style={{ display: drawInfo.az ? '' : 'none' }}>
            {/* <Button className='funcbtn' onClick={() => handleCut(FUZZYSEG)} shape='round'>FuzzySEG</Button>
            <Button className='funcbtn' onClick={() => handleCut(SEG)} shape='round'>SEG</Button>
            <Button className='funcbtn' onClick={() => handleCut(TARJAN)} shape='round'>tarjan</Button>
            <Button className='funcbtn' onClick={() => handleCut(ORIGIN)} shape='round'>Origin</Button> */}
            <div className='title'>算法配置</div>
            <div className='funcoptioncontainer'>
                <p className='functiontitle'>剪枝方法选择:</p>
                <Select className='funcselector'
                    size='small'
                    defaultValue={FUZZYSEG}
                    style={{ width: '80%', marginBottom: '7px' }}
                    onChange={handleCut}
                    options={[
                        {
                            value: FUZZYSEG,
                            label: FUZZYSEG,
                        },
                        {
                            value: SEG,
                            label: SEG,
                        },
                        {
                            value: TARJAN,
                            label: TARJAN,
                        },
                        {
                            value: ORIGIN,
                            label: ORIGIN,
                        },
                    ]}
                />
            </div>
            <div className='funcoptioncontainer'>
                <p className='functiontitle'>聚合强度:</p>
                <SlideBar type="compress" disabled={cutMode === ORIGIN || cutMode === TARJAN || cutMode === SEG} />
            </div>
            {/* <div className='funcoptioncontainer'>
                <p className='functiontitle'>剪枝强度:</p>
                <SlideBar type="cut" disabled={cutMode === ORIGIN || cutMode === TARJAN || cutMode === SEG} />
            </div> */}
            <div className='gobtn'>
                <Button size='small' onClick={handleClick}>节点聚合</Button>
            </div>
        </div>
    )
}

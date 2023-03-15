import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import "./index.css"
import { Slider } from 'antd';
import { changeCutRatio, changeSimilarityThreshold } from "../../../redux/bubbleSlice";

export default function SlideBar(props) {
    const [inputValue, setInputValue] = useState(80);
    const dispatch = useDispatch()
    const onChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        setInputValue(value);
        if (props.type === "compress") {
            //压缩率滑动条
            dispatch(changeSimilarityThreshold({ similarityThreshold: 1 - (value.toString() / 100) }))
        } else if (props.type === "cut") {
            dispatch(changeCutRatio({ cutRatio: value.toString() / 100 }))
        } else {
            return;
        }

    };


    //滑动条设置
    const marks = {
        80: {
            style: {
                fontSize: '0.1px',
                transform: `translate(-10px, -5px)`,
            },
            label: (<span>推荐</span>)
        },
        0: {
            style: {
                fontSize: '0.5px',
                transform: `translate(-6px, -5px)`,
            },
            label: (<span>低</span>)
        },
        100: {
            style: {
                fontSize: '0.5px',
                transform: `translate(-6px, -5px)`,
            },
            label: (<span>高</span>)
        }

    }
    return (
        // <Fragment>
        //     {ratio ? (<div className='slidebarcontainer'>
        //         <Row>
        //             <Col span={5}>
        //                 <p className='slidelabel'>聚合程度: </p>
        //             </Col>
        //             <Col span={12}>
        //                 <Slider
        //                     min={0}
        //                     max={100}
        //                     marks={marks}
        //                     onChange={onChange}
        //                     value={typeof inputValue === 'number' ? inputValue : 0}
        //                     style={{ width: '270px' }}
        //                     step={1}
        //                     tooltip={{
        //                         formatter,
        //                     }}
        //                 />
        //             </Col>
        //         </Row>
        //     </div>) : ''}
        // </Fragment>
        <div className='slidebarcontainer'>

            <Slider
                min={0}
                max={100}
                marks={marks}
                onChange={onChange}
                value={typeof inputValue === 'number' ? inputValue : 0}
                style={{ width: '93%' }}
                step={1}
                tooltip={{ formatter: null }}
                disabled={props.disabled}
            />

        </div>)
}

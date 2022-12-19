import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import "./index.css"
import { Col, InputNumber, Row, Slider } from 'antd';

export default function SlideBar() {
    const ratio = useSelector(state => state.bubble.ratio);
    const [inputValue, setInputValue] = useState(80);
    const onChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        console.log(typeof inputValue);
        setInputValue(value);
    };
    const formatter = (value) => `${value}%`;

    //滑动条设置
    const marks = {
        80: {
            style: {
                fontSize: '1px',
                transform: `translate(-10px, -30px)`,
            },
            label: (<span>80%</span>)
        }
    }
    return (
        <Fragment>
            {ratio ? (<div className='slidebarcontainer'>
                <Row>
                    <Col span={5}>
                        <p className='slidelabel'>聚合程度: </p>
                    </Col>
                    <Col span={12}>
                        <Slider
                            min={0}
                            max={100}
                            marks={marks}
                            onChange={onChange}
                            value={typeof inputValue === 'number' ? inputValue : 0}
                            style={{ width: '270px' }}
                            step={1}
                            tooltip={{
                                formatter,
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={100}
                            style={{
                                margin: '0 16px',
                            }}
                            step={1}
                            formatter={formatter}
                            value={typeof inputValue === 'number' ? inputValue : 0}
                            onChange={onChange}
                        />
                    </Col>
                </Row>
            </div>) : ''}
        </Fragment>

    )
}

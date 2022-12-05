/*
 * @Author: mmy 15224924822@163.com
 * @Date: 2022-11-28 17:05:19
 * @LastEditors: mmy 15224924822@163.com
 * @LastEditTime: 2022-11-29 21:02:10
 * @FilePath: \dataviz\src\pages\OverView\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'

import UserSelection from '../../components/UserSelection'
import Canvas from '../../components/Canvas'
import DataInfo from '../../components/DataInfo'
import Legend from '../../components/Legend'

export default function Overview() {

    return (
        <div className="main">
            <Canvas />
            <UserSelection />
            <DataInfo />
            <Legend />
        </div>

    )
}

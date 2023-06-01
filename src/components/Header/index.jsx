/*
 * @Author: mmy 15224924822@163.com
 * @Date: 2022-12-01 15:47:47
 * @LastEditors: mmy 15224924822@163.com
 * @LastEditTime: 2022-12-01 16:40:51
 * @FilePath: \dataviz\src\components\Header\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import Navigator from '../Navigator'
import "./index.css"

export default function Header() {
    return (
        <div className="header">
            <div className="systemTitle">云服务拓扑图析</div>
            <div className="routerLinkList">
              <Navigator />
            </div>
        </div>
    )
}

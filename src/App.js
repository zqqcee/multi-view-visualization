/*
 * @Author: mmy 15224924822@163.com
 * @Date: 2022-12-01 15:47:46
 * @LastEditors: mmy 15224924822@163.com
 * @LastEditTime: 2022-12-02 13:19:05
 * @FilePath: \dataviz\src\App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './App.css'
import React from 'react'
import Header from './components/Header'
import SwitchBar from './components/SwitchBar'
import { useRoutes } from 'react-router-dom'
import { routesEle } from './routers'
import Navigator from './components/Navigator'


export default function App() {
    return (
        <div>
            <Header />
            <div className="mainBox">
              <SwitchBar />
              <div className="routerView">
                {useRoutes(routesEle)}
              </div>
            </div>
        </div>
    )

}

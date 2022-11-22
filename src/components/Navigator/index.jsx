import React, { useState } from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom'
import { changemode } from '../../redux/optionSlice';
import { changeModeFlag } from '../../redux/modeFlagSlice';
import { useDispatch } from 'react-redux';
import { HIGHLIGHT } from '../../redux/constant';

export default function Navigator() {

    const [current, setCurrent] = useState('homepage')
    const dispatch = useDispatch()
    //FIXME：修复无法高亮选择的路由的Bug
    const handleRouterChange = (e) => {
        setCurrent(e.key)
        //FIXME:在切换路由时判断是否处于overview，控制mode是否可开关
        const location = window.location.href.split('/')
        const route = location[location.length - 1]
        const flag = route === "overview" ? 'true' : false
        //FIXME: 切换路由后，focus mode自动关闭
        dispatch(changeModeFlag({ flag }))
        dispatch(changemode(HIGHLIGHT))
    }


    return (
        <div>
            <Menu mode="horizontal" selectedKeys={[current]} onClick={handleRouterChange} >
                <Menu.Item key="homepage" >
                    <Link to="/homepage" children="home" />
                </Menu.Item>
                <Menu.Item key="overview" >
                    <Link to="/overview" children="overview" />
                </Menu.Item>
                <Menu.Item key="searchview" >
                    <Link to="/searchview" children="search" />
                </Menu.Item>
                <Menu.Item key="bubblesetview" >
                    <Link to="/bubblesetview" children="bubbleset" />
                </Menu.Item>
            </Menu>
        </div>
    )
}

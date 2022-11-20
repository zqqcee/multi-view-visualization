import React from 'react'
import { Menu } from 'antd';
import { Link } from 'react-router-dom'


export default function Navigator() {
    return (
        <div>
            <Menu mode="horizontal" defaultSelectedKeys={['searchview']}>
                <Menu.Item key="overview" >
                    <Link to="/overview" children="overview" />
                </Menu.Item>
                <Menu.Item key="searchview" >
                    <Link to="/searchview" children="search" />
                </Menu.Item>
            </Menu>
        </div>
    )
}

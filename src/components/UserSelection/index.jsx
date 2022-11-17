
import React, { useState } from 'react'
import { Tree } from 'antd';
import "./index.css"
import { getAreaSelection, getRoleSelection, getLinkSelection } from '../../utils/getOptions';
import { useDispatch, useSelector } from 'react-redux';
import { areaoption, roleoption, linkoption } from "../../redux/selectionSlice"
import { dataSets } from '../../utils/getData';


// const optionData = [
//     {
//         title: '0-0',
//         key: '0-0',
//         children: [
//             {
//                 title: '0-0-0',
//                 key: '0-0-0',
//                 children: [
//                     {
//                         title: '0-0-0-0',
//                         key: '0-0-0-0',
//                     },
//                     {
//                         title: '0-0-0-1',
//                         key: '0-0-0-1',
//                     },
//                     {
//                         title: '0-0-0-2',
//                         key: '0-0-0-2',
//                     },
//                 ],
//             },
//             {
//                 title: '0-0-1',
//                 key: '0-0-1',
//                 children: [
//                     {
//                         title: '0-0-1-0',
//                         key: '0-0-1-0',
//                     },
//                     {
//                         title: '0-0-1-1',
//                         key: '0-0-1-1',
//                     },
//                     {
//                         title: '0-0-1-2',
//                         key: '0-0-1-2',
//                     },
//                 ],
//             },
//             {
//                 title: '0-0-2',
//                 key: '0-0-2',
//             },
//         ],
//     },
//     {
//         title: '0-1',
//         key: '0-1',
//         children: [
//             {
//                 title: '0-1-0-0',
//                 key: '0-1-0-0',
//             },
//             {
//                 title: '0-1-0-1',
//                 key: '0-1-0-1',
//             },
//             {
//                 title: '0-1-0-2',
//                 key: '0-1-0-2',
//             },
//         ],
//     },
//     {
//         title: '0-2',
//         key: '0-2',
//     },
// ];


export default function UserSelection() {
    //从store中获取数据
    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]

    const dispatch = useDispatch();

    //获取下拉列表
    let areaSelection = getAreaSelection(data);
    let roleSelection = getRoleSelection(data)
    let linkSelection = getLinkSelection(data)

    /**Area Tree Component default setting */
    const [areaExpandedKeys, setAreaExpandedKeys] = useState(); //展开的az
    const [areaCheckedKeys, setAreaCheckedKeys] = useState(); //选中的区域

    /**Role Tree  Component default setting  */
    const [roleCheckedKeys, setRoleCheckedKeys] = useState(); //选中的角色


    /**Link Tree  Component default setting  */
    const [linkCheckedKeys, setLinkCheckedKeys] = useState(); //选中的角色


    //areaSelection
    const areaOnExpand = (expandAZ) => {
        //树形控件控制
        setAreaExpandedKeys(expandAZ); // 设置
    };
    const areaOnCheck = (checkedKeysValue) => {
        //树形控件控制
        setAreaCheckedKeys(checkedKeysValue);

        //redux状态更新
        dispatch(areaoption(checkedKeysValue))
    };


    //roleSelection
    const roleOnCheck = (checkedKeysValue) => {
        //树形控件控制
        setRoleCheckedKeys(checkedKeysValue);
        //redux状态更新
        dispatch(roleoption(checkedKeysValue))
    };

    //linkSelection
    const linkOnCheck = (checkedKeysValue) => {
        setLinkCheckedKeys(checkedKeysValue);
        dispatch(linkoption(checkedKeysValue))
    }


    return (
        <div className='selection'>
            <div className='areaSelection'>
                <span className='spanLabel'>区域选择</span>
                <Tree
                    style={{ marginTop: '10px' }}
                    checkable
                    onExpand={areaOnExpand}
                    expandedKeys={areaExpandedKeys}
                    autoExpandParent={true}
                    onCheck={areaOnCheck}
                    checkedKeys={areaCheckedKeys}
                    treeData={areaSelection}
                />
            </div>


            <div className='roleSelection'>
                <span className='spanLabel'>角色选择</span>
                <Tree
                    style={{ marginTop: '10px' }}
                    checkable
                    onCheck={roleOnCheck}
                    checkedKeys={roleCheckedKeys}
                    treeData={roleSelection}
                />
            </div>



            <div className='linkSelection'>
                <span className='spanLabel'>连边类型选择</span>
                <Tree
                    style={{ marginTop: '10px' }}
                    checkable
                    onCheck={linkOnCheck}
                    checkedKeys={linkCheckedKeys}
                    treeData={linkSelection}
                />
            </div>


        </div>
    )
}

import { ORIGINMODE, NODEMODE, LINKMODE, ALL, HIGHLIGHTRADIUS, OHTERRADIUS, HIGHLIGHTSTROKE, HIGHLIGHTSTROKEWIDTH, DATANAME, DEFAULTSETTING } from './constant'
import generate from './getData'
const datasets = generate();
const dataName = DATANAME
const setting = DEFAULTSETTING
/**
 * type: 处理类型，分为 ROLE AREA LINK ORIGIN
 * condition: 
 */

/**
 *             "az": "可用区7",
            "pod_name": "nws",
            "type": "XCASTGW",
            "role": "virtual",
            "mgmt_ip": "125.194.176.217",
            "is_alarming": false
 */



const data = datasets[
    dataName
]
const nodes = data.nodes
const edges = data.links
const nodeMap = {}
nodes.forEach(node => {
    nodeMap[node["mgmt_ip"]] = node
})
console.log(edges);


//从数据集中获取筛选框中的Option
const getOptionInfo = () => {
    const roleSet = new Set();
    const azPodSet = new Set();
    const azPodOption = {}  // az-pod的选择框内容

    //az-pod选择框内容
    nodes.forEach(node => {
        roleSet.add(node.role)
        if (!azPodOption.hasOwnProperty(node.az)) {
            azPodOption[node.az] = { value: node.az, label: node.az, children: [{ value: ALL, label: "ALL" }, { value: node["pod_name"], label: node["pod_name"] }] }
            azPodSet.add(`${node.az}-${node.pod_name}`);
        } else {
            //如果pod不在children中
            if (!azPodSet.has(`${node.az}-${node.pod_name}`)) {
                //这个pod需要添加到啊children里
                azPodOption[node.az].children.push({ value: node["pod_name"], label: node["pod_name"] });
                azPodSet.add(`${node.az}-${node.pod_name}`);
            }
        }
    })


    //role选择框内容
    const roleOption = Array.from(roleSet).map(role => {
        return { value: role, label: role.toLowerCase() }
    })

    //link选择框内容
    const linkTypeSet = new Set();
    let linkOption = [{ value: 'ALL', label: "ALL" }]
    edges.forEach((edge) => {
        if (!nodeMap[edge.src_ip]) {
            console.log(edge);
        }
        const src_role = nodeMap[edge.src_ip].role;
        const dst_role = nodeMap[edge.dst_ip].role;
        if (!linkTypeSet.has(`${src_role}-${dst_role}`) && !linkTypeSet.has(`${dst_role}-${src_role}`)) {
            linkTypeSet.add(`${src_role}-${dst_role}`);
            linkOption.push({ value: `${src_role}-${dst_role}`, label: `${src_role}-${dst_role}` })
        }
    })

    return [roleOption, Object.values(azPodOption), linkOption];
}

export const optionInfo = getOptionInfo()

// export const dataOption = Object.entries(datasets).map(entry => {
//     return ({ value: entry[0], label: entry[0] })
// })


/** 
 * 处理节点模式的函数
 * option中包含用户选择的区域
 * role为用户选择查看的角色
 * nodeAlarmingFlag为用户选择是否查看告警节点
 * 如果用户选择查看告警节点，那么只会高亮用户选择的区域中的告警节点
 * 如果用户没有选择查看告警节点，那么会根据用户的选择高亮节点
*/
const handleNodeMode = (option, role, nodeAlarmingFlag) => {
    const { az, pod } = option
    let newNodes;
    if (role) {
        //如果选择了高亮某种role的话，就只把属于所选地域的该role设备高亮出来
        //选择了role，需要判断是否看告警
        //如果选择了查看告警，说明用户想要查看这个区域这个role下的告警节点有多少
        //如果没有选择告警，说明用户想要查看这个区域这个role下的所有节点有多少
        newNodes = nodes.map(node => {
            if (node.az === az && node.pod_name === pod && node.role === role) {
                if (nodeAlarmingFlag) {
                    //如果选择了查看告警，则只高亮告警的节点
                    return node.is_alarming ? { ...node, radius: setting.alarmingnode.radius, color: setting.alarmingnode.color } : { ...node, radius: OHTERRADIUS }
                }
                return { ...node, radius: HIGHLIGHTRADIUS }

                // return { ...node, radius: HIGHLIGHTRADIUS }
            } else {
                //不属于这个区域这个role下的节点，正常显示
                return { ...node, radius: OHTERRADIUS }
            }
        })
    } else {
        //没有选择role，需要判断是否要看告警
        //如果选择了查看告警，说明用户想要看这个区域中所有故障节点有多少
        //如果没有选择告警，那么用户想要查看这个区域中所有节点有多少
        newNodes = nodes.map(node => {
            if (node.az === az && node.pod_name === pod) {
                if (nodeAlarmingFlag) {
                    //如果选择了查看告警，则只高亮告警的节点
                    return node.is_alarming ? { ...node, radius: setting.alarmingnode.radius, color: setting.alarmingnode.color } : { ...node, radius: OHTERRADIUS }
                }
                //如果没有选择查看告警，高亮属于这个区域的所有节点
                return { ...node, radius: HIGHLIGHTRADIUS }

                // return { ...node, radius: HIGHLIGHTRADIUS }
            } else {
                //不属于这个区域的，正常显示
                return { ...node, radius: OHTERRADIUS }
            }
        })
    }

    let nodesToIpMap = {}
    newNodes.forEach(node => {
        nodesToIpMap[node["mgmt_ip"]] = node
    })

    const links = []
    edges.forEach(edge => {
        const source = nodesToIpMap[edge["src_ip"]];
        const target = nodesToIpMap[edge["dst_ip"]];
        links.push({ source, target })
    })

    return { nodes: newNodes, links }
}


const handleOriginMode = (role) => {
    let newNodes;
    if (role) {
        newNodes = nodes.map(node => {
            if (node.role === role) {
                return { ...node, radius: HIGHLIGHTRADIUS }
            } else {
                return { ...node, radius: OHTERRADIUS }
            }
        })
    } else {
        //所有节点
        newNodes = nodes.map(node => {
            if (node.role === role) {
                return { ...node, radius: HIGHLIGHTRADIUS }
            } else {
                return { ...node, radius: OHTERRADIUS }
            }
        })
    }

    let nodesToIpMap = {}
    newNodes.forEach(node => {
        nodesToIpMap[node["mgmt_ip"]] = node
    })

    const links = []
    const newLinks = edges.map(edge => {
        const source = nodesToIpMap[edge["src_ip"]];
        const target = nodesToIpMap[edge["dst_ip"]];

        return ({ source, target, is_alarming: edge.is_alarming })

    })

    return { nodes: newNodes, links: newLinks }
}

/**
 * 处理连边模式的函数
 * option正常会包含两个元素，第一个为link，第二个为筛选的连边 */
const handleLinkMode = (option, linkAlarmingFlag) => {
    let links = edges.map(edge => {
        return { source: nodeMap[edge.src_ip], target: nodeMap[edge.dst_ip], is_alarming: edge.is_alarming }
    })

    if (option[1] === "ALL") {
        //如果用户选择查看全部连边，那么直接判断是否查看告警连边，返回
        const allLinks = links.map(link => {
            return (linkAlarmingFlag && link.is_alarming) ? { ...link, stroke: setting.alarminglink.stroke, 'stokeWidth': setting.alarminglink["stroke-width"] } : { ...link, stroke: setting.strokeSetting.stroke, 'stokeWidth': setting.strokeSetting["stroke-width"] }
        })
        return ({ nodes, links: allLinks })
    }

    const [preCore, sufCore] = option[1].split('-');
    const newLinks = links.map(link => {
        if ((link.source.role === preCore && link.target.role === sufCore) || (link.target.role === preCore && link.source.role === sufCore)) {
            //需要被高亮的连边
            if (linkAlarmingFlag) {
                //需要显示告警的连边,那么就只显示这些连边，其他连边不管
                return link.is_alarming ? { ...link, stroke: setting.alarminglink.stroke, 'stokeWidth': setting.alarminglink["stroke-width"] } : { ...link, stroke: setting.strokeSetting.stroke, 'stokeWidth': setting.strokeSetting["stroke-width"] }
            }
            //不需要显示告警的连边，那么就只高亮用户想查看的连边
            return { ...link, stroke: HIGHLIGHTSTROKE, 'stokeWidth': HIGHLIGHTSTROKEWIDTH }

        } else {
            //不在用户选择范围内的连边，需要判断用户是否想查看告警连边。
            //如果用户不想查看告警连边，那么其他的就正常显示，如果用户想查看告警连边，那么其他的就标红，但是不要太粗
            if (linkAlarmingFlag) {
                //用户要看告警，没被选中的连边标红，但是不要太粗,颜色浅一些
                return link.is_alarming ? { ...link, stroke: setting.alarminglink["stroke-unselected"], 'stokeWidth': setting.alarminglink["stroke-width-unselected"] } : { ...link, stroke: setting.strokeSetting.stroke, 'stokeWidth': setting.strokeSetting["stroke-width"] }
            }
            //用户不看告警，没被选中的连边正常显示
            return { ...link, stroke: setting.strokeSetting.stroke, 'stokeWidth': setting.strokeSetting["stroke-width"] }

        }
    })

    return ({ nodes, links: newLinks })

}


/**
 * nodeOption: 一个包含mode与data的option，
 *      mode：有origin：原始模式， nodemode：过滤区域模式，linkmode：过滤连边模式
 *      data：传入的az，pod等
 * roleOption：传入的角色, 如core，spine等。这里的角色是从数据集中自动获取的，所以选择框的value和数据集中的角色一一对应
 * 返回所需数据集
 * 
 */
export const handleData = (
    modeOption = ORIGINMODE,
    roleOption = undefined,
    nodeAlarmingFlag,
    linkAlarmingFlag
) => {

    switch (modeOption.mode) {
        case ORIGINMODE:
            return handleOriginMode(roleOption)
        case NODEMODE:
            return handleNodeMode(modeOption.data, roleOption, nodeAlarmingFlag);
        case LINKMODE:
            return handleLinkMode(modeOption.data, linkAlarmingFlag);
        default:
            return null
    }
}



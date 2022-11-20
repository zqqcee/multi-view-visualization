/** 计算过滤数据的详细信息 */

/**
 * role
 * alarming
 */
export const getNodesDetail = (nodes) => {
    let info = { alarmingCnt: 0 }
    nodes.forEach(node => {
        if (info[node.role]) {
            info[node.role] += 1
        } else {
            info[node.role] = 1
        }
        if (node.is_alarming) {
            info.alarmingCnt += 1
        }
    })
    return info
}


/**
 * link-type
 * alarming
 */
export const getLinksDetail = (links) => {
    let info = { alarmingCnt: 0 }
    links.forEach(link => {
        if (info[`${link.source.role}_${link.target.role}`] || info[`${link.target.role}_${link.source.role}`]) {
            if (info[`${link.source.role}_${link.target.role}`]) {
                info[`${link.source.role}_${link.target.role}`] += 1
            } else {
                info[`${link.target.role}_${link.source.role}`] += 1
            }
        } else {
            info[`${link.source.role}_${link.target.role}`] = 1
        }

        if (link.is_alarming) {
            info.alarmingCnt += 1
        }
    })

    return info
}

export const getAreaDetail = (nodes) => {
    let info = {}
    nodes.forEach(node => {
        if (info[`${node.az}`]) {
            info[`${node.az}`] += 1
        } else {
            info[`${node.az}`] = 1
        }
        if (info[`${node.az}_${node.pod_name}`]) {
            info[`${node.az}_${node.pod_name}`] += 1
        } else {
            info[`${node.az}_${node.pod_name}`] = 1
        }
    })
    return info
}


/** 用于搜索组件中的自动补全 */
/**
 * @param data 数据集
 * @param value 用户输入
 */
export const getIpOption = (data, value) => {
    const nodes = data.nodes
    const ipList = nodes.map(node => node.mgmt_ip)
    return ipList.filter(ip => ip.indexOf(value) >= 0).map(ip => ({ label: ip, value: ip }))
}




/** 用于获取图例中的角色信息 */
export const getLegendInfo = (data) => {
    const nodes = data.nodes
    let info = []
    nodes.forEach(node => {
        if (info.indexOf(node.role) < 0) {
            info.push(node.role)
        }
    })
    info.push('alarmingNode')
    return info
}
/**获取所有options */

/**
 *  [
        {
            title: 'az1',
            key: 'az1',
            children: [
                {
                    title: 'cnt',
                    key: 'cnt',
                }
            ]
        },

        {
            tile:'az2',
            key:'az2'
            children:[]
        }
    ]
    key是我们选择的值
    title是显示在tree中的内容
    判断方式
 */

export const getAreaSelection = (data) => {
    //id:az_pod_role
    //class:role
    const areaObj = {} //一个obj，key为az，value为pod，方便生成option

    const nodes = data.nodes;
    nodes.forEach(node => {
        const az = node.az
        const pod = node.pod_name
        if (!areaObj[az]) {
            //未存在，创建一个集合
            areaObj[az] = new Set()
        }

        areaObj[az].add(pod)

    })

    const option = Object.entries(areaObj).map(([az, podSet]) => {
        const curOption = {}
        curOption.title = az;
        curOption.key = az;
        curOption.children = []
        for (let pod of podSet) {
            curOption.children.push(
                {
                    title: pod,
                    key: `${az}_${pod}`
                }
            )
        }
        return curOption
    })

    return option

}


export const getDataOption = (dataSets) => {
    return Object.entries(dataSets).map(([dataname, _]) => {
        const nodesCnt = dataSets[dataname].nodes.length
        const linksCnt = dataSets[dataname].links.length
        const alarmingnodescnt = dataSets[dataname].nodes.filter(node => node.is_alarming).length
        const alarminglinkscnt = dataSets[dataname].links.filter(link => link.is_alarming).length
        return { label: `${dataname} => 点:${nodesCnt}(${alarmingnodescnt}告警) || 边:${linksCnt}(${alarminglinkscnt}告警)  `, value: dataname }
    })
}


export const getRoleSelection = (data) => {
    let roleSet = new Set()
    let roleSelection = []
    data.nodes.forEach(node => {
        roleSet.add(node.role || "unknown")
    })

    for (let role of roleSet) {
        roleSelection.push({
            title: role,
            key: role
        })
    }
    return roleSelection
}


export const getLinkSelection = (data) => {
    const nodesIpRoleMap = {}
    const nodes = data.nodes
    const links = data.links
    const linksTypeSet = new Set()
    const linkSelection = []

    nodes.forEach(node => {
        nodesIpRoleMap[node.mgmt_ip] = node
    })
    links.forEach(link => {
        let src_role = nodesIpRoleMap[link.src_ip].role
        let dst_role = nodesIpRoleMap[link.dst_ip].role

        if (!linksTypeSet.has(`${src_role}-${dst_role}`) && !linksTypeSet.has(`${dst_role}-${src_role}`)) {
            linksTypeSet.add(`${src_role}-${dst_role}`)
        }
    })

    for (let linkType of linksTypeSet) {
        linkSelection.push({
            title: linkType,
            key: linkType
        })
    }

    return linkSelection
}
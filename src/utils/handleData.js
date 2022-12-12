/**
 * 
 * @param {*} data 原始数据
 * @return {*} nodes不变，links变为source,target，并且属性值为node
 */
export const handleData = (data) => {
    let nodes = data.nodes
    let links = data.links
    const nodesIpMap = {}
    nodes.forEach(node => {
        nodesIpMap[node.mgmt_ip] = node
    })
    links = links.map(link => {
        return ({
            ...link,
            source: nodesIpMap[link["src_ip"]],
            target: nodesIpMap[link["dst_ip"]]
        })
    })


    return ({ nodes, links })
}




/** 获取层次化数据 */
export const hierarchyData = (data) => {

    const nodes = data.nodes
    const links = data.links

    const hierarchicalData = {
        hierachy: 'region',
        children: []
    }

    nodes.forEach(node => {
        let curAzIndex = hierarchicalData.children.findIndex(d => d.name === node.az)
        if (curAzIndex < 0) {
            hierarchicalData.children.push({ name: node.az, children: [] })
        }
        //else存在，进行下一步

        curAzIndex = curAzIndex === -1 ? hierarchicalData.children.length - 1 : curAzIndex; //如果不存在就是最后一个
        let curAz = hierarchicalData.children[curAzIndex]
        let curPodIndex = curAz.children.findIndex(d => d.name === node.pod_name)

        if (curPodIndex < 0) {
            curAz.children.push({
                "name": node.pod_name,
                "hierarchy": "pod",
                "num": 0,
                "nodes": [], // 记录当前pod里面所有节点的mgmt_ip
                "links": [], // 记录当前pod里面的所有连边关系
                "is_alarming": false
            })
        }

        curPodIndex = curPodIndex === -1 ? curAz.children.length - 1 : curPodIndex
        let curPod = curAz.children[curPodIndex]

        curPod.nodes.push(node)
        curPod.num += 1
        if (node.is_alarming) {
            curPod.is_alarming = true
        }
    })

    //添加连边
    links.forEach(link => {
        //判断souce和target是否在同一个pod中
        const source = nodes.find(d => d.mgmt_ip === link.src_ip)
        const target = nodes.find(d => d.mgmt_ip === link.dst_ip)

        let curAzIndex = hierarchicalData.children.findIndex(d => d.name === source.az)
        let curPodIndex = hierarchicalData.children[curAzIndex].children.findIndex(d => d.name === source.pod_name)
        let curPod = hierarchicalData.children[curAzIndex].children[curPodIndex]


        if (curPod.nodes.findIndex(d => d.mgmt_ip === source.mgmt_ip) >= 0 && curPod.nodes.findIndex(d => d.mgmt_ip === target.mgmt_ip) >= 0) {
            curPod.links.push({
                ...link, source, target
            })
        }

    })


    return hierarchicalData
}


/**
 * 根据节点与数据集获取连边，一般用于根据某项规则筛选节点，并获取其nodelink数据
 * @param data : 完整数据集
 * @param nodes: 从data中按照特定规则筛选出的nodes
 * @return {nodes,links} 完整数据集
 */
export const getLinksByNodes = (data, nodes) => {

    const links = data.links.filter(link => nodes.findIndex(node => node.mgmt_ip === link.src_ip) >= 0 && nodes.findIndex(node => node.mgmt_ip === link.dst_ip) >= 0)
    return { nodes, links }

}


/**
 * 根据数据集获取AZ与POD的连边
 * {
 *  {nodes:[name:az1,nodes:[],links:[] ],  links:[source,target]}
 * }
 */
export const getAreaLink = (data) => {
    const { links } = handleData(data);
    let res = { nodes: [], links: [] }
    links.forEach(link => {

        if (link.source.az !== link.target.az) {
            //两个az不相等
            let source = { name: link.source.az, nodes: [], links: [] }
            let target = { name: link.target.az, nodes: [], links: [] }

            if (!res.nodes.find(d => d.name === source.name)) {
                res.nodes.push(source)
            }
            if (!res.nodes.find(d => d.name === target.name)) {
                res.nodes.push(target)
            }
            if (!((res.links.find(d => d.source === source.name) && res.links.find(d => d.target === target.name)) ||
                (res.links.find(d => d.target === source.name) && res.links.find(d => d.source === target.name)))) {
                res.links.push({ source: source.name, target: target.name })
            }
        } else if (link.source.pod_name !== link.target.pod_name) {
            //两个az相等，但是pod不相等

            if (!res.nodes.find(d => d.name === link.source.az)) {
                //az还不存在
                res.nodes.push({ name: link.source.az, nodes: [], links: [] })
            }
            let curAz = res.nodes.find(d => d.name === link.source.az)

            if (!curAz.nodes.find(d => d.name === link.source.pod_name)) {
                curAz.nodes.push({ name: link.source.pod_name })
            }
            if (!curAz.nodes.find(d => d.name === link.target.pod_name)) {
                curAz.nodes.push({ name: link.target.pod_name })
            }

            if (!((curAz.links.find(d => d.source === link.source.pod_name) && curAz.links.find(d => d.target === link.target.pod_name)) || (curAz.links.find(d => d.target === link.source.pod_name) && curAz.links.find(d => d.source === link.target.pod_name)))) {
                curAz.links.push({ source: link.source.pod_name, target: link.target.pod_name })
            }
        }

    })

    return res

}


/**
 * 将后端返回的数据变成可以绘制的nodes，links 格式
 */
export const handleCutData = (groupList, groupLinks) => {
    let cutNodes = []
    let cutLinks = []

    cutNodes = groupList.map(group => {
        return { index: group.groupIndex, ...group }
    })

    cutLinks = groupLinks.map(grouplink => {
        let source = cutNodes.find(node => node.index === grouplink.source);
        let target = cutNodes.find(node => node.index === grouplink.target);
        return { source, target }
    })

    return { cutNodes, cutLinks }
}
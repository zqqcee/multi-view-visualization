
export const dataInfo = (data) => {
    console.log(data);
    const nodes = data.nodes
    const edges = data.links
    const nodeMap = {}
    //统计信息
    let roleInfo = {};
    let linkInfo = {};
    let azSet = new Set();
    let podSet = new Set();
    const nodeCnt = nodes.length;
    const linkCnt = edges.length;
    let alarmingNodesCnt = 0
    let alarmingLinksCnt = 0

    nodes.forEach(node => {
        nodeMap[node["mgmt_ip"]] = node
        azSet.add(node.az);
        podSet.add(`${node.az}-${node.pod_name}`)
        roleInfo[node.role] = roleInfo.hasOwnProperty(node.role) ? roleInfo[node.role] + 1 : 1
        if (node["is_alarming"]) { alarmingNodesCnt += 1 }
    })
    edges.forEach(edge => {
        const srcRole = nodeMap[edge.src_ip].role;
        const dstRole = nodeMap[edge.dst_ip].role;
        if (edge["is_alarming"]) { alarmingLinksCnt += 1 }
        if (linkInfo.hasOwnProperty(`${srcRole}-${dstRole}`)) {
            linkInfo[`${srcRole}-${dstRole}`] += 1
        } else if (linkInfo.hasOwnProperty(`${dstRole}-${srcRole}`)) {
            linkInfo[`${dstRole}-${srcRole}`] += 1
        } else {
            linkInfo[`${srcRole}-${dstRole}`] = 1
        }
    })

    const podCnt = podSet.size
    const azCnt = azSet.size
    return [nodeCnt, linkCnt, podCnt, azCnt, roleInfo, linkInfo, alarmingNodesCnt, alarmingLinksCnt]

}

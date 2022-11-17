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
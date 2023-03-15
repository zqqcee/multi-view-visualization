import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { dataSets } from '../../utils/getData'
import { handleData, neighboringTable } from "../../utils/handleData"
import { SETTING } from './constant'
import * as d3 from "d3"
import "./index.css"
import { searchAlarmingNum, searchNum } from '../../redux/searchInfoSlice'


let simulation
export default function SearchSvg() {

    const dataName = useSelector(state => state.option.dataName)
    const datasource = dataSets[dataName]
    const data = handleData(datasource)

    const neighborTable = neighboringTable(datasource)

    const searchIps = useSelector(state => state.searchInfo.value)
    const oneHopFlag = useSelector(state => state.searchInfo.oneHopFlag)
    const twoHopFlag = useSelector(state => state.searchInfo.twoHopFlag)
    const highlightFlag = useSelector(state => state.searchInfo.highlightFlag)
    const allOneHopFlag = useSelector(state => state.searchInfo.allOneHopFlag)
    const allTwoHopFlag = useSelector(state => state.searchInfo.allTwoHopFlag)
    const dispatch = useDispatch()
    const [firstIp, secondIp] = searchIps.split('/')
    console.log(firstIp)

    const [chosenNode, setChosenNode] = useState(firstIp)
    // setChosenNode(firstIp)

    // console.log(neighborTable[chosenNode])

    

    useEffect(() => {
        if (!searchIps) {
            cleanSvg()
            return
        }
        cleanSvg()
        initSvg()
        let datum = getDataByFindPath(searchIps)//根据用户输入的ip得到的需要绘制的数据
        console.log(oneHopFlag)
        // console.log(chosenNode)
        if (oneHopFlag) {
            datum = renewDataByOneHop(datum)
        }
        if (twoHopFlag) {
            datum = renewDataByTwoHop(datum)
        }
        if (allOneHopFlag) {
            datum = renewAllDataByOneHop(datum)
        }
        if (allTwoHopFlag) {
            datum = renewAllDataByTwoHop(datum)
        }
        if (datum.nodes.length) {
            drawLayout(datum)
        }

        //FIXME: return会导致第二次检索画布上没有节点
        // return (() => {
        //     cleanSvg();
        //     dispatch(search({ value: "" }))
        // })
    }, [searchIps, oneHopFlag, twoHopFlag, allOneHopFlag, allTwoHopFlag])


    useEffect(() => {
        if (highlightFlag) {
            highlightCircle(searchIps);
        } else {
            cancelHighlightCircle()
        }
    }, [highlightFlag])

    useEffect(() => {
        // 想在这里修改被选中节点的样式， 但注释掉的那一行始终会报错
        d3.select('#scontainer').selectAll('path').attr('class', '')
        let id = chosenNode
        if(!id) {
            return 
        }
        id = 'group_' + id
        console.log(id)
        // d3.select('#scontainer').select(`#${id}`).select('path').attr('class', 'bling')
    }, [chosenNode])



    /**
     * @param zoomObj: 绑定的d3.zoom()对象
     * @param svgContainerId: svg标签Id
     * @param svgBodyId: g标签Id
     * @param marginParam: 边距设置
     * @param duration: 动画时长
     * 
     */
    const autoZoom = (zoomObj, svgContainerId, svgBodyId, marginParam, duration) => {

        const svgContainer = document.querySelector(`#${svgContainerId}`);
        const svgBody = d3.select(`#${svgBodyId}`);

        const viewBox = svgBody.node().getBBox();//g
        //svg
        const containerWidth = svgContainer.clientWidth
        const containerHeight = svgContainer.clientHeight
        // margin setting
        const rowMargin = marginParam.row
        const colMargin = marginParam.col

        const scale = Math.min((containerWidth - rowMargin) / viewBox.width, (containerHeight - colMargin) / viewBox.height)

        const offsetX = (containerWidth - rowMargin) / 2 - (viewBox.x + viewBox.width / 2) * scale
        const offsetY = (containerHeight - colMargin) / 2 - (viewBox.y + viewBox.height / 2) * scale

        // d3.zoomIdentity:缩放参数，返回Transform{k:1,x:0,y:0}
        const t = d3.zoomIdentity.translate(offsetX, offsetY).scale(scale)
        d3.select(`#${svgContainerId}`).transition().duration(duration).call(zoomObj.transform, t)
    }

    const initSvg = () => {
        const height = document.querySelector("#scontainer").clientHeight
        const width = document.querySelector("#scontainer").clientWidth
        let svgContainer = d3.select("#scontainer").append('svg')
            .attr('id', 'svgContainer')
            .attr('class', 'svgContainer')
            .attr('height', height)
            .attr('width', width)

        svgContainer.append('g')
            .attr('id', 'svg')
            .attr('class', 'svg')
            .attr('height', height)
            .attr('width', width)

        let zoomObj = d3.zoom()
            .scaleExtent([1 / 50, 2])

        svgContainer.call(
            zoomObj.on('zoom', e => {
                let { k, x, y } = e.transform;
                d3.select('#svg').style('transform', `translate(${x}px, ${y}px) scale(${k})`);
            })
        )

        document.onkeydown = (e) => {
            if (e.keyCode === 17) {
                autoZoom(
                    zoomObj,
                    'svgContainer',
                    'svg',
                    {
                        row: 20,
                        col: 100
                    },
                    1000
                )
            }

        }

    }

    const cleanSvg = () => {
        simulation ? simulation.stop() : simulation = null
        d3.select('#scontainer').select('*').remove()
    }

    /**
     * @param searchIps:用户输入的两个ip地址，用‘/’分隔
     * @return {nodes,links}: json数据，用于渲染
     */
    const getDataByFindPath = (searchIps) => {
        const [firstIp, secondIp] = searchIps.split('/')
        //找firstIp与secondIp之间的最短路径
        //找firstIp与secondIp之间的最短路径
        const nodes = data.nodes
        const links = data.links
        let nodesSet = new Set()
        let linksSet = new Set()
        let queue = [] // BFS遍历队列
        let dist = {} // 到各个点的最短路径长度
        let path = {} // 最短路径
        let usedNode = [] // 防止死循环，去除重复节点
        let alarming = 0
        queue.push(firstIp)
        dist[firstIp] = 0
        while(queue.length !== 0){
            let ips = neighborTable[queue[0]]
            usedNode.push(queue[0])
            if(queue[0] === secondIp)
                break
            ips.forEach(ip => {
                if(usedNode.indexOf(ip) === -1){
                    queue.push(ip)
                    if(dist[ip] !== undefined){
                        if(dist[ip] > dist[queue[0]]){
                            dist[ip] = dist[queue[0]] + 1
                            path[ip] = queue[0]
                        }
                    }
                    else {
                        dist[ip] = dist[queue[0]] + 1
                        path[ip] = queue[0]
                    }
                }
            })

            queue.shift()
        }
        let name = secondIp
        if(usedNode.indexOf(name) !== -1){
            while(name){
                let node = nodes.find(node => node.mgmt_ip === name)
                let forward = name
                nodesSet.add(node)
                if(node.is_alarming === true)
                    alarming = alarming + 1
                name = path[name]
                if(name){
                    linksSet.add(links.find(link => link.dst_ip === forward && link.src_ip === name || link.src_ip === forward && link.dst_ip === name))
                }
            }
        }
        else {
            nodesSet.add(nodes.find(node => node.mgmt_ip === firstIp))
            nodesSet.add(nodes.find(node => node.mgmt_ip === secondIp))
        }
        let ipsNum = dist[secondIp]
        if(ipsNum === undefined)
            ipsNum = 0
        dispatch(searchNum(ipsNum))
        dispatch(searchAlarmingNum(alarming))
        // return dist[secondIp] //最短路径长度

        return { nodes: Array.from(nodesSet), links: Array.from(linksSet) }

    }

    const renewDataByOneHop = (datum) => {
        const nodes = data.nodes
        const links = data.links
        let ips = neighborTable[chosenNode]
        ips.forEach(ip => {
            let node = nodes.find(node => node.mgmt_ip === ip)
            if(datum.nodes.indexOf(node) === -1){
                datum.nodes.push(node)
                datum.links.push(links.find(link => link.dst_ip === ip && link.src_ip === chosenNode || link.src_ip === ip && link.dst_ip === chosenNode))
            }
            
        })

        return datum
    }

    const renewDataByTwoHop = (datum) => {
        const nodes = data.nodes
        const links = data.links
        let nodesSet = new Set()
        let linksSet = new Set()
        let ips = neighborTable[chosenNode]
        ips.forEach(ip => {
            let node = nodes.find(node => node.mgmt_ip === ip)
            nodesSet.add(node)
            linksSet.add(links.find(link => link.dst_ip === ip && link.src_ip === chosenNode || link.src_ip === ip && link.dst_ip === chosenNode))
                

            let secondIps = neighborTable[ip]
            secondIps.forEach(secondIp => {
                let node = nodes.find(node => node.mgmt_ip === secondIp)
                nodesSet.add(node)
                linksSet.add(links.find(link => link.dst_ip === secondIp && link.src_ip === ip || link.src_ip === secondIp && link.dst_ip === ip))
                
            })
        })
        datum.nodes.forEach(node => {
            nodesSet.add(node)
        })
        datum.links.forEach(link => {
            linksSet.add(link)
        })

        return { nodes: Array.from(nodesSet), links: Array.from(linksSet) }
    }

    const renewAllDataByOneHop = (datum) => {
        const nodes = data.nodes
        const links = data.links
        let nodesSet = new Set()
        let linksSet = new Set()
        datum.nodes.forEach(node => {
            nodesSet.add(node)
            let chosenNode = node.mgmt_ip
            let ips = neighborTable[chosenNode]
            ips.forEach(ip => {
                let node = nodes.find(node => node.mgmt_ip === ip)
                nodesSet.add(node)
                linksSet.add(links.find(link => link.dst_ip === ip && link.src_ip === chosenNode || link.src_ip === ip && link.dst_ip === chosenNode))
                
            })
        })
        datum.links.forEach(link => {
            linksSet.add(link)
        })

        return { nodes: Array.from(nodesSet), links: Array.from(linksSet) }
    }

    const renewAllDataByTwoHop = (datum) => {
        const nodes = data.nodes
        const links = data.links
        let nodesSet = new Set()
        let linksSet = new Set()
        datum.nodes.forEach(node => {
            nodesSet.add(node)
            let chosenNode = node.mgmt_ip
            let ips = neighborTable[chosenNode]
            ips.forEach(ip => {
                let node = nodes.find(node => node.mgmt_ip === ip)
                nodesSet.add(node)
                linksSet.add(links.find(link => link.dst_ip === ip && link.src_ip === chosenNode || link.src_ip === ip && link.dst_ip === chosenNode))
                

                let secondIps = neighborTable[ip]
                secondIps.forEach(secondIp => {
                    let node = nodes.find(node => node.mgmt_ip === secondIp)
                    nodesSet.add(node)
                    linksSet.add(links.find(link => link.dst_ip === secondIp && link.src_ip === ip || link.src_ip === secondIp && link.dst_ip === ip))
                    
                })
            })
        })
        datum.links.forEach(link => {
            linksSet.add(link)
        })

        return { nodes: Array.from(nodesSet), links: Array.from(linksSet) }
    }

    const drawLayout = (data) => {
        const svg = d3.select('#svg')
        svg.select('*').remove()
        let nodes = data.nodes
        let links = data.links
        if (!nodes.length) {
            return;
        }
        const height = document.querySelector("#scontainer").clientHeight
        const width = document.querySelector("#scontainer").clientWidth


        //FIXME: 先添加link，再添加circle，可以保证连边在circle的下层
        const linkLine = svg.append('g')
            .attr('class', 'links')
            .attr('id', 'links')
            .selectAll('.linkG')
            .data(links)
            .join('line')
            .attr('class', 'link')
            .attr('id', d => `${d.source.mgmt_ip}_${d.target.mgmt_ip}`)
            .attr('stroke', d => d.stroke || SETTING.fill.stroke)
            .attr('stroke-width', d => d.stokeWidth || SETTING.size.linkStrokeWidth)


        const nodeG = svg.append('g')
            .attr('class', 'nodes')
            .attr('id', 'nodes')
            .selectAll('.nodeG')
            .data(nodes)
            .join('g')
            .attr('class', 'nodeGroup')
            .attr('id', d => `group_${d.mgmt_ip}`)
            .on('click', (e, d) => {
                // let chosenNode1 = d.mgmt_ip
                // dispatch(changeChosenNode({chosenNode : chosenNode1}))
                setChosenNode(d.mgmt_ip)
            })


        const fixNodes = (curNode) => {
            nodes.forEach(function (d) {
                if (curNode !== d) {
                    d.fx = d.x;
                    d.fy = d.y;
                }
            });
        }

        let nodeSymbol = nodeG
            .append('path')
            .attr('class', 'nodeCircle')
            // .attr('class', 'bling')
            .attr('d', d3.symbol().type((d) => {
                switch (d.role.toLowerCase()) {
                    case "core":
                        return d3.symbolStar;
                    case "spine":
                        return d3.symbolTriangle;
                    case "leaf" || "tor":
                        return d3.symbolCircle;
                    default:
                        return d3.symbolSquare
                }
            }).size(SETTING.size.nodeRadius * 20))
            // .attr('class','bling')
            .attr('id', d => `ip_${d.mgmt_ip.replaceAll('.', "")}`)
            // .attr('r', SETTING.size.nodeRadius)
            .attr('fill', d => SETTING.fill[d.role.toLowerCase()])
            .call(
                d3.drag()
                    .on('start', event => {
                        //d3.event.active代表的是除去当前事件，当前正在发生的拖动事件的个数。
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        event.subject.fx = event.subject.x;
                        event.subject.fy = event.subject.y;
                    })
                    .on('drag', event => {
                        event.subject.fx = event.x;
                        event.subject.fy = event.y;
                        if (SETTING.dragMode.flag) {
                            fixNodes(event.subject)
                        }
                    })
                    .on('end', event => {
                        // simulation.alphaTarget(simulation.alphaMin() * 0.1).restart()
                        simulation.alphaTarget(0.3).restart()
                    })
            );




            simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(d => d.is_alarming ? SETTING.size.nodeRadius * 3 : SETTING.size.nodeRadius).strength(0.8))
            //设定forceX与forceY使得它们更加聚拢在中间位置
            //FIXME:调整了strength
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1))
            .force("link", d3.forceLink(links).id(d => {
                return d.mgmt_ip
            }).strength(0.5).distance(10))
            .on("tick", () => {
                linkLine.attr("x1", function (d) { return parseInt(d.source.x); })
                    .attr("y1", function (d) { return parseInt(d.source.y); })
                    .attr("x2", function (d) { return parseInt(d.target.x); })
                    .attr("y2", function (d) { return parseInt(d.target.y); });
                nodeSymbol.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
            })
    }

    const highlightCircle = (searchIps) => {
        const ipList = searchIps.split('/')
        ipList.forEach(ip => {
            if (!ip) {
                return
            }
            d3.select(`#ip_${ip.replaceAll('.', "")}`).attr('class', 'bling').attr('r', SETTING.size.nodeRadius + 2)
        })
    }

    const cancelHighlightCircle = () => {
        d3.select('#scontainer').selectAll('path').attr('class', '').attr('r', SETTING.size.nodeRadius)
    }

    return (
        <Fragment>
            <div id='scontainer' className='scontainer' />
        </Fragment>
    )
}

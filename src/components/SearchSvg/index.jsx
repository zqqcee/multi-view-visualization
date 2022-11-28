import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { dataSets } from '../../utils/getData'
import { handleData } from "../../utils/handleData"
import { SETTING } from './constant'
import * as d3 from "d3"
import "./index.css"


let simulation
export default function SearchSvg() {


    const dataName = useSelector(state => state.option.dataName)
    const datasource = dataSets[dataName]
    const data = handleData(datasource)

    const searchIps = useSelector(state => state.searchInfo.value)
    const twoHopFlag = useSelector(state => state.searchInfo.twoHopFlag)
    const highlightFlag = useSelector(state => state.searchInfo.highlightFlag)
    console.log(highlightFlag);

    useEffect(() => {
        if (!searchIps) {
            cleanSvg()
            return
        }
        cleanSvg()
        initSvg()
        const datum = getDataBySearchIps(searchIps)//根据用户输入的ip得到的需要绘制的数据
        if (datum.nodes.length) {
            drawLayout(datum)
        }

        //FIXME: return会导致第二次检索画布上没有节点
        // return (() => {
        //     cleanSvg();
        //     dispatch(search({ value: "" }))
        // })
    }, [searchIps, twoHopFlag])


    useEffect(() => {
        if (highlightFlag) {
            highlightCircle(searchIps);
        } else {
            cancelHighlightCircle()
        }
    }, [highlightFlag])



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
    const getDataBySearchIps = (searchIps) => {
        const [firstIp, secondIp] = searchIps.split('/')
        //找与firstIp与secondIp相连的两跳邻居
        const nodes = data.nodes
        const links = data.links
        let nodesSet = new Set()
        let linksSet = new Set()

        //加入两个节点
        if (nodes.find(node => node.mgmt_ip === firstIp)) {
            nodesSet.add(nodes.find(node => node.mgmt_ip === firstIp))
        }
        if (nodes.find(node => node.mgmt_ip === secondIp)) {
            nodesSet.add(nodes.find(node => node.mgmt_ip === secondIp))
        }

        //firstIp
        links.forEach(link => {
            if (link.src_ip === firstIp || link.dst_ip === firstIp) {
                nodesSet.add(link.source)
                nodesSet.add(link.target)
                linksSet.add(link)
                if (twoHopFlag) {
                    let curSrcIp = link.source.mgmt_ip
                    let curDstIp = link.target.mgmt_ip
                    links.forEach(link => {
                        if (link.src_ip === curSrcIp || link.dst_ip === curSrcIp || link.src_ip === curDstIp || link.dst_ip === curDstIp) {
                            nodesSet.add(link.source)
                            nodesSet.add(link.target)
                            linksSet.add(link)
                        }
                    })
                }

            }
        })

        //secondIp，添加之前要判断是否存在第二个ip
        if (secondIp) {
            links.forEach(link => {
                if (link.src_ip === secondIp || link.dst_ip === secondIp) {
                    nodesSet.add(link.source)
                    nodesSet.add(link.target)
                    linksSet.add(link)
                    if (twoHopFlag) {
                        let curSrcIp = link.source.mgmt_ip
                        let curDstIp = link.target.mgmt_ip
                        links.forEach(link => {
                            if (link.src_ip === curSrcIp || link.dst_ip === curSrcIp || link.src_ip === curDstIp || link.dst_ip === curDstIp) {
                                nodesSet.add(link.source)
                                nodesSet.add(link.target)
                                linksSet.add(link)
                            }
                        })
                    }

                }
            })
        }

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
            .attr('id', d => `${d.mgmt_ip}_group`)


        const fixNodes = (curNode) => {
            nodes.forEach(function (d) {
                if (curNode !== d) {
                    d.fx = d.x;
                    d.fy = d.y;
                }
            });
        }





        let nodeCircle = nodeG
            .append('circle')
            .attr('class', 'nodeCircle')
            // .attr('class','bling')
            .attr('id', d => `ip_${d.mgmt_ip.replaceAll('.', "")}`)
            .attr('r', SETTING.size.nodeRadius)
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
            .force("charge", d3.forceManyBody().strength(-80))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(SETTING.size.nodeRadius).strength(0.8))
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
                nodeCircle.attr("cx", function (d) { return parseInt(d.x); })
                    .attr("cy", function (d) { return parseInt(d.y); });
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
        d3.select('#scontainer').selectAll('circle').attr('class', '').attr('r', SETTING.size.nodeRadius)
    }

    return (
        <Fragment>
            <div id='scontainer' className='scontainer' />
        </Fragment>
    )
}

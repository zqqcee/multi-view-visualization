import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dataSets } from '../../utils/getData'
import { handleData } from "../../utils/handleData"
import { search } from '../../redux/searchInfoSlice'
import { SETTING } from './constant'
import * as d3 from "d3"
import "./index.css"


let simulation
export default function SearchSvg() {


    const dataName = useSelector(state => state.option.dataName)
    const datasource = dataSets[dataName]
    const data = handleData(datasource)

    const searchIps = useSelector(state => state.searchInfo.value)
    const dispatch = useDispatch()


    useEffect(() => {
        if (!searchIps) {
            cleanSvg()
            return
        }
        cleanSvg()
        initSvg()
        initLegend()
        const datum = getDataBySearchIps(searchIps)//根据用户输入的ip得到的需要绘制的数据
        if (datum.nodes.length) {
            drawLayout(datum)
        }

        return (() => {
            cleanSvg();
            dispatch(search({ value: "" }))
        })

    }, [searchIps])




    const initSvg = () => {
        const height = document.querySelector("#scontainer").clientHeight
        const width = document.querySelector("#scontainer").clientWidth
        let svgContainer = d3.select("#scontainer").append('g')
            .attr('id', 'svgContainer')
            .attr('class', 'svgContainer')
            .attr('height', height)
            .attr('width', width)

        svgContainer.append('svg')
            .attr('id', 'svg')
            .attr('class', 'svg')
            .attr('height', height)
            .attr('width', width)

        svgContainer.call(
            d3.zoom()
                .scaleExtent([1 / 50, 2])
                .on('zoom', e => {
                    d3.select("#svgContainer").attr("transform", e.transform)
                    let { k, x, y } = e.transform;
                    d3.select('#svg').style('transform', `translate(${x}px, ${y}px) scale(${k})`);
                })
        )

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
        console.log(searchIps);
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
            if (link.source === firstIp || link.dst_ip === firstIp) {
                nodesSet.add(link.source)
                nodesSet.add(link.target)
                linksSet.add(link)
                let curSrcIp = link.source
                let curDstIp = link.target
                links.forEach(link => {
                    if (link.src_ip === curSrcIp || link.dst_ip === curSrcIp || link.src_ip === curDstIp || link.dst_ip === curDstIp) {
                        nodesSet.add(link.source)
                        nodesSet.add(link.target)
                        linksSet.add(link)
                    }
                })
            }
        })

        //secondIp，添加之前要判断是否存在第二个ip
        if (secondIp) {
            links.forEach(link => {
                if (link.source === secondIp || link.dst_ip === secondIp) {
                    nodesSet.add(link.source)
                    nodesSet.add(link.target)
                    linksSet.add(link)
                    let curSrcIp = link.source
                    let curDstIp = link.target
                    links.forEach(link => {
                        if (link.src_ip === curSrcIp || link.dst_ip === curSrcIp || link.src_ip === curDstIp || link.dst_ip === curDstIp) {
                            nodesSet.add(link.source)
                            nodesSet.add(link.target)
                            linksSet.add(link)
                        }
                    })
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

        simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-80))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(SETTING.size.nodeRadius).strength(0.8))
            //设定forceX与forceY使得它们更加聚拢在中间位置
            .force("x", d3.forceX(width / 2).strength(0))
            .force("y", d3.forceY(height / 2).strength(0))
            .force("link", d3.forceLink(links).id(d => {
                return d.mgmt_ip
            }).strength(0.5).distance(10))
            .on("tick", () => {
                nodeCircle.attr("cx", function (d) { return parseInt(d.x); })
                    .attr("cy", function (d) { return parseInt(d.y); });

                linkLine.attr("x1", function (d) { return parseInt(d.source.x); })
                    .attr("y1", function (d) { return parseInt(d.source.y); })
                    .attr("x2", function (d) { return parseInt(d.target.x); })
                    .attr("y2", function (d) { return parseInt(d.target.y); });
            })

    }

    const initLegend = () => {

    }

    return (
        <Fragment>
            <div id='scontainer' className='scontainer' />
        </Fragment>
    )
}

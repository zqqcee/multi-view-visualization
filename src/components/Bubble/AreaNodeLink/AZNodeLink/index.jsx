import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dataSets } from '../../../../utils/getData'
import { handleData, getAreaLink } from '../../../../utils/handleData'
import * as d3 from "d3"
import "./index.css"
import { SETTING } from "./constant"
import { changeAreaInfo, changeDrawInfo } from "../../../../redux/bubbleSlice"

let simulation
let zoomObj
export default function AZNodeLink() {

    const dataName = useSelector(state => state.option.dataName)
    const data = handleData(dataSets[dataName])
    const drawData = getAreaLink(data)

    const areaInfo = useSelector(state => state.bubble.areaInfo)
    const drawInfo = useSelector(state => state.bubble.drawInfo)
    const dispatch = useDispatch()

    useEffect(() => {
        const container = d3.select('#aznodelinkContainer')
        if (container) {
            container.select('*').remove()
        }
        initSvg()
        drawLayout(drawData)
    }, [dataName])


    useEffect(() => {
        d3.select('#aznodelinkContainer').selectAll('circle').attr('class', '')
        const az = drawInfo.az
        if (!az) {
            return
        }
        d3.select('#aznodelinkContainer').select(`#${az}`).select('circle').attr('class', 'bling')
    }, [drawInfo])


    const initSvg = () => {
        const width = document.querySelector('#aznodelinkContainer').clientWidth
        const height = document.querySelector('#aznodelinkContainer').clientHeight
        const svgContainer = d3.select('#aznodelinkContainer').append('svg')
            .attr('id', 'aznodelinkSvgContainer')
            .attr('class', 'aznodelinkSvgContainer')
            .attr('width', width)
            .attr('height', height)

        svgContainer.append('g')
            .attr('id', 'aznodelinkSvg')
            .attr('class', 'aznodelinkSvg')
        // .attr('transform', 'translate(0,100)')

        zoomObj = d3.zoom()
            .scaleExtent([1 / 50, 2])

        svgContainer.call(
            zoomObj.on('zoom', e => {
                let { k, x, y } = e.transform;
                d3.select('#aznodelinkSvg').style('transform', `translate(${x}px, ${y}px) scale(${k})`);
            })

        )

        // document.onkeydown = (e) => {
        //     if (e.keyCode === 17) {
        //         autoZoom(
        //             zoomObj,
        //             'aznodelinkSvgContainer',
        //             'aznodelinkSvg',
        //             {
        //                 row: 20,
        //                 col: 10
        //             },
        //             1000
        //         )
        //     }
        // }

    }




    const drawLayout = (data) => {
        const svg = d3.select('#aznodelinkSvg')
        svg.select('*').remove()
        const nodes = data.nodes
        const links = data.links

        if (!nodes.length) {
            return;
        }
        const height = document.querySelector("#aznodelinkContainer").clientHeight
        const width = document.querySelector("#aznodelinkContainer").clientWidth


        const linkLine = svg.append('g')
            .attr('class', 'links')
            .attr('id', 'links')
            .selectAll('.linkG')
            .data(links)
            .join('line')
            .attr('class', 'link')
            .attr('id', d => `${d.source.name}_${d.target.name}`)
            .attr('stroke', d => d.stroke || SETTING.fill.stroke)
            .attr('stroke-width', d => SETTING.size.linkStrokeWidth)


        const nodeG = svg.append('g')
            .attr('class', 'nodes')
            .attr('id', 'nodes')
            .selectAll('.nodeG')
            .data(nodes)
            .join('g')
            .attr('class', 'nodeGroup')
            .attr('id', d => d.name)
            .on("click", (e, d) => {
                let drawInfo
                drawInfo = {az : d.name}
                console.log(d.name)
                dispatch(changeDrawInfo({ drawInfo }))
            })
            // .call(
            //     d3.drag()
            //         .on('start', event => {
            //             //d3.event.active代表的是除去当前事件，当前正在发生的拖动事件的个数。
            //             if (!event.active) simulation.alphaTarget(0.3).restart();
            //             event.subject.fx = event.subject.x;
            //             event.subject.fy = event.subject.y;
            //         })
            //         .on('drag', event => {
            //             event.subject.fx = event.x;
            //             event.subject.fy = event.y;
            //             if (SETTING.dragMode.flag) {
            //                 fixNodes(event.subject)
            //             }
            //         })
            //         .on('end', event => {
            //             // simulation.alphaTarget(simulation.alphaMin() * 0.1).restart()
            //             simulation.alphaTarget(0.3).restart()
            //         })
            // );


        const fixNodes = (curNode) => {
            nodes.forEach(function (d) {
                if (curNode !== d) {
                    d.fx = d.x;
                    d.fy = d.y;
                }
            });
        }

        let nodeSymbol = nodeG
            .append('circle')
            .attr('class', 'nodeSymbol')
            .attr('r', SETTING.size.nodeRadius)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', '2px')


        let nodeText = nodeG.append('text')
            .attr('x', 0)
            .attr('y', -15)
            .style('font-size', '10px')
            .html(d => d.name)



        simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(10).strength(0.8))
            //设定forceX与forceY使得它们更加聚拢在中间位置
            //FIXME:调整了strength
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1))
            .force("link", d3.forceLink(links).id(d => {
                return d.name
            }).strength(0.5).distance(10))
            .on("tick", () => {
                linkLine.attr("x1", function (d) { return parseInt(d.source.x); })
                    .attr("y1", function (d) { return parseInt(d.source.y); })
                    .attr("x2", function (d) { return parseInt(d.target.x); })
                    .attr("y2", function (d) { return parseInt(d.target.y); });
                nodeG.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
            })
            .on("end", () => {
                autoZoom(
                    zoomObj,
                    'aznodelinkSvgContainer',
                    'aznodelinkSvg',
                    {
                        row: 20,
                        col: 10
                    },
                    1000
                )
            })

    }

    const autoZoom = (zoomObj, svgContainerId, svgBodyId, marginParam, duration) => {

        const svgContainer = document.querySelector(`#${svgContainerId}`);
        const svgBody = d3.select(`#${svgBodyId}`);
        if (!svgContainer) {
            return;
        }

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
        const t = d3.zoomIdentity.translate(offsetX + rowMargin / 2, offsetY).scale(scale)
        d3.select(`#${svgContainerId}`).transition().duration(duration).call(zoomObj.transform, t)
    }


    return (
        <div className='aznodelinkContainer' id="aznodelinkContainer">

        </div>
    )
}

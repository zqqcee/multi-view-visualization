import React, { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dataSets } from '../../utils/getData'
import { hierarchyData } from "../../utils/handleData";
import * as d3 from "d3"
import "./index.css"
import { changeAreaInfo, changeDrawInfo } from "../../redux/bubbleSlice"
import AreaInfo from './AreaInfo';

export default function Bubble() {
    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]
    const hierarchicalData = hierarchyData(data)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        initSvg()
    }, [])


    useEffect(() => {
        d3.select('#svgContainer').select('*').remove()
        d3.select('#svgContainer').remove()
        initSvg()
        draw(hierarchicalData, d3.select('#svg'))
    }, [dataName, hierarchicalData])


    const initSvg = () => {

        const width = document.querySelector('#bubbleContainer').clientWidth
        const height = document.querySelector('#bubbleContainer').clientHeight
        const svgContainer = d3.select('#bubbleContainer').append('svg')
            .attr('id', 'svgContainer')
            .attr('class', 'svgContainer')
            .attr('width', width)
            .attr('height', height)

        const svg = svgContainer.append('g')
            .attr('id', 'svg')
            .attr('class', 'svg')
            .attr('transform', 'translate(0,-10)')

        let zoomObj = d3.zoom()
            .scaleExtent([1 / 50, 2])

        svgContainer.call(
            zoomObj.on('zoom', e => {
                let { k, x, y } = e.transform;
                d3.select('#bubbleContainer').select('#svg').style('transform', `translate(${x}px, ${y}px) scale(${k})`);
            })
        )
    }


    /**
     * @param data: 处理后的层次化数据
     * @param graph: 画布 <g>
     */
    const draw = (data, graph) => {

        const width = document.querySelector('#bubbleContainer').clientWidth
        const height = document.querySelector('#bubbleContainer').clientHeight
        let root = d3.hierarchy(data).sum(d => d.hasOwnProperty('num') ? d.num : 0)
        //分配坐标
        //TODO:看Pack的源码
        var partition = d3.pack()
            .size([width, height])
            .padding(5);
        partition(root);


        const bubbleGroup = graph.selectAll('.bubbleGroup')
            .data(root.descendants().filter(d => d.parent))
            .join('g')
            .attr('class', 'bubbleGroup')
            .attr('id', d => {
                if (d.depth === 1) {
                    return d.data.name || 'null'
                } else if (d.depth === 2) {
                    let pod_name = d.data.name || 'null'
                    return `${d.parent.data.name}_${pod_name}`
                } else {
                    return 'null'
                }
            })

        const bubbleCircle = bubbleGroup.append('circle')
            .attr('class', d => {
                if (d.data.is_alarming) {
                    return 'alarmingBubble'
                }
                return 'normalBubble'
            })
            .style('opacity', d => {
                return d['depth'] / 3
            })
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.r)
            .on('mouseenter', (e, d) => {
                let areaInfo
                if (d.depth === 1) {
                    areaInfo = `${d.data.name}`
                    d3.select(e.target).attr('r', d => d.r + 3)
                } else if (d.depth === 2) {
                    areaInfo = `${d.parent.data.name}_${d.data.name}`
                    d3.select(e.target).attr('r', d => d.r + 3)
                } else {
                    areaInfo = ''
                }
                dispatch(changeAreaInfo({ areaInfo }))
            })
            .on('mouseleave', (e, d) => {
                if (d.depth <= 1) {
                    dispatch(changeAreaInfo({ areaInfo: '' }))
                }
                d3.select(e.target).attr('r', d => d.r)
            })
            .on('click', (e, d) => {
                //传入redux中，node-link图
                let drawInfo
                if (d.depth === 1) {
                    drawInfo = { az: d.data.name }
                } else if (d.depth === 2) {
                    drawInfo = { az: d.parent.data.name, pod: d.data.name }
                } else {
                    drawInfo = {}
                }

                dispatch(changeDrawInfo({ drawInfo }))
            })

    }


    return (
        <div className='bubbleContainer' id='bubbleContainer'>
            <AreaInfo />
        </div>
    )
}

import React, { useEffect } from 'react'
import "./index.css"
import { getLegendInfo } from "../../utils/getDataInfo"
import { dataSets } from '../../utils/getData'
import { useSelector } from 'react-redux'
import * as d3 from "d3"
import { SETTING } from '../Canvas/constant'


export default function Legend() {
    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]
    //只有角色
    const legendList = getLegendInfo(data)

    useEffect(() => {
        const height = document.querySelector('#legendContainer').clientHeight
        const width = document.querySelector('#legendContainer').clientWidth
        const padding = 30
        const circleOffset = 20
        const textOffset = 25
        const marginLeft = 20
        const normalRadius = 6
        const alarmingRadius = 9
        const lineMarginLeft = 8
        const lineWidth = 20

        d3.select('#legendContainer').select('*').remove()

        const svg = d3.select('#legendContainer')
            .append('svg')
            .attr('class', 'svg')
            .attr('id', 'svg')
            .attr('height', height)
            .attr('width', width)
        // .attr('transform', `translate(${-width},${-height})`)

        const legendGroup = svg.selectAll('.legendG')
            .data(legendList)
            .join('g')
            .attr('class', 'legendGroup')
            .attr('id', d => `${d.toLowerCase()}_group`)

        const legendLength = legendList.filter(d => d !== 'alarmingNode' && d.toLowerCase() !== 'server').length
        //FIXME:服务器有两个属性，图例上只画一个
        legendList.filter(d => d !== 'alarmingNode' && d.toLowerCase() !== 'server').forEach((d, i) => {

        
            // legendGroup
            //     .append('circle')
            //     .attr('id', d => `${d}_circle`)
            //     .attr('class', d => `legendCircle`)
            //     .attr('cx', (d, i) => marginLeft)
            //     .attr('cy', (d, i) => padding * i + circleOffset)
            //     .attr('r', d => d === 'alarmingNode' ? alarmingRadius : normalRadius)
            //     .attr('fill', d => SETTING.fill[d.toLowerCase()] || SETTING.alarming.node.fill)


            d3.select(`#${d.toLowerCase()}_group`)
            .append('path')
            .attr('d', d3.symbol().type((d) => {
                switch (d.toLowerCase()) {
                    case "core":
                        return d3.symbolStar;
                    case "spine":
                        return d3.symbolTriangle;
                    case "leaf" || "tor":
                        return d3.symbolCircle;
                    default:
                        return d3.symbolSquare
                }
            }).size(SETTING.size.symbolSize))
            .attr('transform', `translate(${marginLeft},${padding * i + circleOffset})`)
            .attr('fill', SETTING.fill[d.toLowerCase()])

            d3.select(`#${d.toLowerCase()}_group`)
            .append('text')
            .attr('id', d => `${d}_text`)
            .attr('class', d => `legendText`)
            .attr('x', marginLeft * 2)
            .attr('y', padding * i + textOffset)
            .html(d => `正常 ${d.toLowerCase()}`)

            // legendGroup
            //     .append('text')
            //     .attr('id', d => `${d}_text`)
            //     .attr('class', d => `legendText`)
            //     .attr('x', marginLeft * 2)
            //     .attr('y', (d, i) => padding * i + textOffset)
            //     .html(d => d.toLowerCase())

            //告警图例
            d3.select(`#${d.toLowerCase()}_group`)
                .append('path')
                .attr('d', d3.symbol().type((d) => {
                    switch (d.toLowerCase()) {
                        case "core":
                            return d3.symbolStar;
                        case "spine":
                            return d3.symbolTriangle;
                        case "leaf" || "tor":
                            return d3.symbolCircle;
                        default:
                            return d3.symbolSquare
                    }
                }).size(SETTING.size.symbolSize))
                .attr('transform', `translate(${marginLeft},${padding * (i + legendLength) + circleOffset})`)
                .attr('fill', SETTING.alarming.node.fill)

            d3.select(`#${d.toLowerCase()}_group`)
                .append('text')
                .attr('id', d => `${d}_text`)
                .attr('class', d => `legendText`)
                .attr('x', marginLeft * 2)
                .attr('y', padding * (i + legendLength) + textOffset)
                .html(d => `告警 ${d.toLowerCase()}`)
        })

        // const normalLinkGroup = svg
        //     .append('g')
        //     .attr('id', 'normalLink')
        //     .attr('class', 'normalLink')
        // normalLinkGroup
        //     .append('line')
        //     .attr("x1", lineMarginLeft)
        //     .attr("y1", legendList.length * padding + textOffset)
        //     .attr("x2", lineMarginLeft + lineWidth)
        //     .attr("y2", legendList.length * padding + textOffset)
        //     .attr("stroke", SETTING.fill.stroke)
        //     .attr("stroke-width", "3");

        // normalLinkGroup
        //     .append('text')
        //     .attr('id', 'normalLink')
        //     .attr('class', 'link')
        //     .attr('x', lineMarginLeft + lineWidth + 13)
        //     .attr('y', legendList.length * padding + textOffset + 5)
        //     .html('link')


        // const alarmLinkGroup = svg
        //     .append('g')
        //     .attr('id', 'normalLink')
        //     .attr('class', 'alarmLink')


        // alarmLinkGroup
        //     .append('line')
        //     .attr("x1", lineMarginLeft)
        //     .attr("y1", (legendList.length + 1) * padding + textOffset)
        //     .attr("x2", lineMarginLeft + lineWidth)
        //     .attr("y2", (legendList.length + 1) * padding + textOffset)
        //     .attr("stroke", SETTING.alarming.link.stroke)
        //     .attr("stroke-width", "3");


        // alarmLinkGroup
        //     .append('text')
        //     .attr('id', 'alarmLink')
        //     .attr('class', 'link')
        //     .attr('x', lineMarginLeft + lineWidth + 13)
        //     .attr('y', (legendList.length + 1) * padding + textOffset + 5)
        //     .html('alarminglink')
        // return (() => {
        //     d3.select('#legendContainer').select('*').remove()
        // })
    }, [dataName])

    // const initLegend = () => {

    // }

    return (
        <div className='legendContainer' id="legendContainer" style={{marginTop: '50px'}}>

        </div>
    )
}

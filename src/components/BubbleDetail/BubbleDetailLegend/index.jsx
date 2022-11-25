import React, { useEffect } from 'react'
import "./index.css"
import { getLegendInfo } from '../../../utils/getDataInfo'
import { useSelector } from 'react-redux'
import { dataSets } from '../../../utils/getData'
import * as d3 from "d3"
import { SETTING } from "../constant"
export default function BubbleDetailLegend() {

    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]
    const legendList = getLegendInfo(data)

    //TODO legend

    useEffect(() => {
        const height = document.querySelector('#bubbleDetailLegendContainer').clientHeight
        const width = document.querySelector('#bubbleDetailLegendContainer').clientWidth
        const padding = 30
        const circleOffset = 20
        const textOffset = 25
        const marginLeft = 20
        const normalRadius = 6
        const alarmingRadius = 9
        const lineMarginLeft = 8
        const lineWidth = 20


        d3.select('#bubbleDetailLegendContainer').select('*').remove()

        const svg = d3.select('#bubbleDetailLegendContainer')
            .append('svg')
            .attr('class', 'bubbleDetailLegendSvg')
            .attr('id', 'bubbleDetailLegendSvg')
            .attr('height', height)
            .attr('width', width)
        // .attr('transform', `translate(${-width},${-height})`)

        const legendGroup = svg.selectAll('.legendG')
            .data(legendList)
            .join('g')
            .attr('class', 'legendGroup')
            .attr('id', d => `${d.toLowerCase()}_group`)


        const getShape = (d) => {
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
        }


        const legendLength = legendList.filter(d => d !== 'alarmingNode' && d.toLowerCase() !== 'server').length
        //FIXME:服务器有两个属性，图例上只画一个
        legendList.filter(d => d !== 'alarmingNode' && d.toLowerCase() !== 'server').forEach((d, i) => {


            //TODO: 加文字
            d3.select(`#${d.toLowerCase()}_group`)
                .append('path')
                .attr('d', d3.symbol().type(getShape).size(SETTING.size.symbolSize))
                //     .attr('class', `legendSymbol`)
                // .attr('x', marginLeft)
                .attr('transform', `translate(${marginLeft},${padding * i + circleOffset})`)
                .attr('fill', SETTING.fill.normalNode)


            d3.select(`#${d.toLowerCase()}_group`)
                .append('text')
                .attr('id', d => `${d}_text`)
                .attr('class', d => `legendText`)
                .attr('x', marginLeft * 2)
                .attr('y', padding * i + textOffset)
                .html(d => `正常 ${d.toLowerCase()}`)




            //告警图例
            d3.select(`#${d.toLowerCase()}_group`)
                .append('path')
                .attr('d', d3.symbol().type(getShape).size(SETTING.size.symbolSize))
                .attr('transform', `translate(${marginLeft},${padding * (i + legendLength) + circleOffset})`)
                .attr('fill', SETTING.fill.alarmingNode)

            d3.select(`#${d.toLowerCase()}_group`)
                .append('text')
                .attr('id', d => `${d}_text`)
                .attr('class', d => `legendText`)
                .attr('x', marginLeft * 2)
                .attr('y', padding * (i + legendLength) + textOffset)
                .html(d => `告警 ${d.toLowerCase()}`)



        })


    }, [dataName, legendList])







    return (
        <div className='bubbleDetailLegendContainer' id='bubbleDetailLegendContainer'>

        </div>
    )
}

import React, { Fragment, useEffect, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { dataSets } from '../../utils/getData'
import "./index.css"
import * as d3 from "d3"

export default function SearchSvg() {


    const dataName = useSelector(state => state.option.dataName)
    const data = dataSets[dataName]

    const searchIps = useSelector(state => state.searchInfo.value)


    useLayoutEffect(() => {
        initSvg()
    }, [searchIps])

    const initSvg = () => {
        const height = document.querySelector("#container").clientHeight
        const width = document.querySelector("#container").clientWidth
        const svg = d3.select("#container").append('g')
            .attr('id', 'svgContainer')
            .attr('class', 'svgContainer')
            .attr('height', height)
            .attr('width', width)
            .append('svg')
            .attr('id', 'svg')
            .attr('class', 'svg')
            .attr('height', height)
            .attr('width', width)
    }





    const getDataBySearchIps = (searchIps) => {
        const [firstIp, secondIp] = searchIps.split('/')
        //找与firstIp与secondIp相连的两跳邻居
        



    }


    const drawNodes = (nodes, links) => {
        const svg = d3.select('#svg')


    }



    return (
        <Fragment>
            <div id='container' className='container'>

            </div>
            <button onClick={initSvg}>test</button>
        </Fragment >
    )
}

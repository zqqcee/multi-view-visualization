
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import "./index.css"
import * as d3 from "d3"
import { DEFAULT, FOCUS, HIGHLIGHT } from '../../redux/constant'
import { SETTING } from './constant'
import { dataSets } from '../../utils/getData'
import { handleData } from '../../utils/handleData'

/** global storage */
let transformObj = { k: 1, x: 1, y: 0 };
let initFlag = false

let needToHighLightNodeIp = new Set() // 记录全局的需要高亮的节点
let needToHighLightLink = []

//TODO:节点拖拽
//TODO:自动缩放
//TODO:bubbleSet
//TODO: 修改focusNode
export default function Canvas() {
    const dataName = useSelector(state => state.option.dataName)
    const datasource = dataSets[dataName]
    const data = handleData(datasource)
    const mode = useSelector(state => state.option.mode)
    const area = useSelector(state => state.selection.area)
    const role = useSelector(state => state.selection.role)
    const link = useSelector(state => state.selection.link)

    let nodes = data.nodes
    let links = data.links

    useLayoutEffect(() => {
        initCanvas()

    }, [dataName])



    useEffect(() => {
        switch (mode) {
            case HIGHLIGHT:
                if (initFlag) {
                    initCanvas()
                }
                highlightmode(area, role, link)
                break;
            case FOCUS:
                focusmode(area, role, link)
                initFlag = true
                break;
            default:
                break;

        }
    }, [mode, area, role, link])


    const initCanvas = () => {
        d3.select('#container').select('*').remove()
        const height = document.querySelector("#container").clientWidth
        const width = document.querySelector("#container").clientWidth
        const canvasContainer = d3.select('#container').append('g')
            .attr('id', 'canvasContainer')
            .attr('class', 'canvasContainer')
            .attr('height', height)
            .attr('width', width)
            .call(
                d3.zoom()
                    .scaleExtent([1 / 100, 930])
                    .on('zoom', (event) => {
                        transformObj = event.transform;
                        //拖动的时候，需要判断是否存在高亮的节点
                        renderRefresh();
                    })
            )

        const canvas = canvasContainer.append('canvas')
            .attr('id', 'canvasNode')
            .attr('class', 'canvasNode')
            .attr('height', height)
            .attr('width', width)
        const ctx = canvas.node().getContext('2d')

        let simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-90))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(4).strength(0.8))
            //设定forceX与forceY使得它们更加聚拢在中间位置
            .force("x", d3.forceX(width / 2).strength(0.15))
            .force("y", d3.forceY(height / 2).strength(0.15))
            .force("link", d3.forceLink(links).id(d => {
                return d.mgmt_ip
            }).strength(0.5).distance(10))
            .on("tick", () => { if (simulation.alpha() < 0.1) simulation.stop(); renderRefresh() })


        //FIXME: 在高亮模式下保证刷新不用重绘
        const drawNodes = () => {

            if (needToHighLightNodeIp.size === 0) {
                nodes.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                    ctx.arc(node.x, node.y, SETTING.size.nodeRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = SETTING.fill[node.role.toLowerCase()]
                    ctx.fill();
                })
            } else {
                const needToHightLightNode = nodes.filter(node => needToHighLightNodeIp.has(node.mgmt_ip))
                const needToHideNode = nodes.filter(node => !needToHighLightNodeIp.has(node.mgmt_ip))
                needToHideNode.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                    ctx.arc(node.x, node.y, SETTING.size.nodeRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = SETTING.opacityFill.default
                    ctx.fill();
                })
                needToHightLightNode.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                    ctx.arc(node.x, node.y, SETTING.size.nodeRadius * 2, 0, 2 * Math.PI);
                    ctx.fillStyle = SETTING.fill[node.role.toLowerCase()]
                    ctx.fill();
                })
            }
        }
        const drawLinks = () => {
            links.filter(link => needToHighLightLink.indexOf(link) < 0).forEach(link => {
                ctx.beginPath();
                const distance = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
                const newSourceNode = {
                    x: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.x - link.target.x) + link.target.x,

                    y: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.y - link.target.y) + link.target.y,
                }
                const newTargetNode = {
                    x: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.x - link.target.x) + link.target.x,
                    y: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.y - link.target.y) + link.target.y,
                }
                ctx.moveTo(newSourceNode.x, newSourceNode.y);
                ctx.lineTo(newTargetNode.x, newTargetNode.y);
                ctx.strokeStyle = SETTING.fill.stroke;
                ctx.lineWidth = SETTING.size.linkStrokeWidth;
                ctx.stroke();
            })

            needToHighLightLink.forEach(link => {
                ctx.beginPath();
                const distance = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
                const newSourceNode = {
                    x: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.x - link.target.x) + link.target.x,

                    y: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.y - link.target.y) + link.target.y,
                }
                const newTargetNode = {
                    x: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.x - link.target.x) + link.target.x,
                    y: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.y - link.target.y) + link.target.y,
                }

                if (needToHighLightLink.indexOf(link) >= 0) {
                    ctx.strokeStyle = SETTING.fill.highlightLinkStroke;
                    ctx.lineWidth = SETTING.size.highlightLinkStrokeWidth;
                } else {
                    ctx.strokeStyle = SETTING.fill.stroke;
                    ctx.lineWidth = SETTING.size.linkStrokeWidth;
                }
                ctx.moveTo(newSourceNode.x, newSourceNode.y);
                ctx.lineTo(newTargetNode.x, newTargetNode.y);
                ctx.stroke();
            })
        }
        const renderRefresh = () => {
            ctx.save();
            ctx.clearRect(0, 0, width, height);
            ctx.translate(transformObj.x, transformObj.y);
            ctx.scale(transformObj.k, transformObj.k);
            drawNodes();
            drawLinks();
            ctx.restore();
        }


    }

    const initCanvasByData = (nodes, links) => {
        d3.select('#container').select('*').remove()
        const height = document.querySelector("#container").clientWidth
        const width = document.querySelector("#container").clientWidth
        const canvasContainer = d3.select('#container').append('g')
            .attr('id', 'canvasContainer')
            .attr('class', 'canvasContainer')
            .attr('height', height)
            .attr('width', width)
            .call(
                d3.zoom()
                    .scaleExtent([1 / 100, 930])
                    .on('zoom', (event) => {
                        transformObj = event.transform;
                        renderRefresh();

                    })
            )

        const canvas = canvasContainer.append('canvas')
            .attr('id', 'canvasNode')
            .attr('class', 'canvasNode')
            .attr('height', height)
            .attr('width', width)
        const ctx = canvas.node().getContext('2d')

        let simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-90))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(4).strength(0.8))
            //设定forceX与forceY使得它们更加聚拢在中间位置
            .force("x", d3.forceX(width / 2).strength(0.15))
            .force("y", d3.forceY(height / 2).strength(0.15))
            .force("link", d3.forceLink(links).id(d => {
                return d.mgmt_ip
            }).strength(0.5).distance(10))
            .on("tick", () => { if (simulation.alpha() < 0.1) simulation.stop(); renderRefresh() })



        const drawNodes = () => {
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                ctx.arc(node.x, node.y, SETTING.size.nodeRadius, 0, 2 * Math.PI);
                ctx.fillStyle = SETTING.fill[node.role.toLowerCase()]
                ctx.fill();
            })
        }

        const drawLinks = () => {
            links.forEach(link => {
                ctx.beginPath();
                const distance = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
                const newSourceNode = {
                    x: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.x - link.target.x) + link.target.x,

                    y: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.y - link.target.y) + link.target.y,
                }

                const newTargetNode = {
                    x: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.x - link.target.x) + link.target.x,
                    y: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.y - link.target.y) + link.target.y,
                }
                ctx.moveTo(newSourceNode.x, newSourceNode.y);
                ctx.lineTo(newTargetNode.x, newTargetNode.y);

                ctx.strokeStyle = SETTING.fill.stroke;
                ctx.lineWidth = SETTING.size.linkStrokeWidth;
                ctx.stroke();
            })
        }

        const renderRefresh = () => {
            ctx.save();
            ctx.clearRect(0, 0, width, height);
            ctx.translate(transformObj.x, transformObj.y);
            ctx.scale(transformObj.k, transformObj.k);
            drawLinks();
            drawNodes();
            ctx.restore();
        }

    }

    /**
     * 高亮模式
     * @param areaOption : 每个元素是一个数组，第一个元素是AZ，第二个元素是POD
     * @param roleOption : 用户选择角色的数组
     * @param linkOption : 用户选择连边类型的数组
     */
    const highlightmode = (areaOption, roleOption, linkOption) => {
        initFlag = false//进入高亮模式后，就不用初始化画布了

        //绘制参数初始化
        const ctx = d3.select('#canvasNode').node().getContext('2d')
        const height = document.querySelector("#container").clientWidth
        const width = document.querySelector("#container").clientWidth
        needToHighLightNodeIp = new Set();
        needToHighLightLink = []


        const drawNodes = () => {
            if (needToHighLightNodeIp.size === 0) {
                nodes.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                    ctx.arc(node.x, node.y, SETTING.size.nodeRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = SETTING.fill[node.role.toLowerCase()]
                    ctx.fill();
                })
            } else {
                const needToHightLightNode = nodes.filter(node => needToHighLightNodeIp.has(node.mgmt_ip))
                const needToHideNode = nodes.filter(node => !needToHighLightNodeIp.has(node.mgmt_ip))
                needToHideNode.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                    ctx.arc(node.x, node.y, SETTING.size.nodeRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = SETTING.opacityFill.default
                    ctx.fill();
                })
                needToHightLightNode.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + SETTING.size.nodeRadius, node.y);
                    ctx.arc(node.x, node.y, SETTING.size.nodeRadius * 2, 0, 2 * Math.PI);
                    ctx.fillStyle = SETTING.fill[node.role.toLowerCase()]
                    ctx.fill();
                })
            }
        }

        const drawLinks = () => {
            links.filter(link => needToHighLightLink.indexOf(link) < 0).forEach(link => {
                ctx.beginPath();
                const distance = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
                const newSourceNode = {
                    x: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.x - link.target.x) + link.target.x,

                    y: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.y - link.target.y) + link.target.y,
                }
                const newTargetNode = {
                    x: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.x - link.target.x) + link.target.x,
                    y: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.y - link.target.y) + link.target.y,
                }
                ctx.moveTo(newSourceNode.x, newSourceNode.y);
                ctx.lineTo(newTargetNode.x, newTargetNode.y);
                ctx.strokeStyle = SETTING.fill.stroke;
                ctx.lineWidth = SETTING.size.linkStrokeWidth;
                ctx.stroke();
            })
            needToHighLightLink.forEach(link => {
                ctx.beginPath();
                const distance = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
                const newSourceNode = {
                    x: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.x - link.target.x) + link.target.x,

                    y: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.y - link.target.y) + link.target.y,
                }
                const newTargetNode = {
                    x: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.x - link.target.x) + link.target.x,
                    y: ((SETTING.size.nodeRadius + 0) / distance) *
                        (link.source.y - link.target.y) + link.target.y,
                }

                if (needToHighLightLink.indexOf(link) >= 0) {
                    ctx.strokeStyle = SETTING.fill.highlightLinkStroke;
                    ctx.lineWidth = SETTING.size.highlightLinkStrokeWidth;
                } else {
                    ctx.strokeStyle = SETTING.fill.stroke;
                    ctx.lineWidth = SETTING.size.linkStrokeWidth;
                }
                ctx.moveTo(newSourceNode.x, newSourceNode.y);
                ctx.lineTo(newTargetNode.x, newTargetNode.y);
                ctx.stroke();
            })
        }

        const renderRefresh = () => {
            ctx.save();
            ctx.clearRect(0, 0, width, height);
            ctx.translate(transformObj.x, transformObj.y);
            ctx.scale(transformObj.k, transformObj.k);
            drawNodes();
            drawLinks();
            ctx.restore();
        }


        //如果三个条件都是空，重绘
        if (!areaOption.length && !roleOption.length && !linkOption.length) {
            //三个都没选，初始渲染
            renderRefresh()
            return;
        }


        //到了这里说明都不是空
        if (areaOption.length) {
            //如果用户选择了区域，就要进一步判断是否选择了role
            nodes.forEach(node => {
                if (areaOption.indexOf(`${node.az}_${node.pod_name}`) >= 0) {
                    if (roleOption.length) {
                        //如果选了role，就加role满足条件的
                        if (roleOption.indexOf(`${node.role}`) >= 0) {
                            needToHighLightNodeIp.add(node.mgmt_ip)
                        }
                    } else {
                        //如果没选role，就全部加
                        needToHighLightNodeIp.add(node.mgmt_ip)
                    }
                }
            })
        } else if (roleOption.length) {
            //如果用户没有选择区域，那么要只需要判断role
            nodes.forEach(node => {
                if (roleOption.indexOf(`${node.role}`) >= 0) {
                    needToHighLightNodeIp.add(node.mgmt_ip)
                }
            })
        } else if (linkOption.length) {
            //连边不空，但是区域和角色空，那么就把全部满足类别的连边画上去，画完饭回
            links.forEach(link => {
                if ((linkOption.indexOf(`${link.source.role}-${link.target.role}`) >= 0 || linkOption.indexOf(`${link.target.role}-${link.source.role}`) >= 0)) {
                    needToHighLightLink.push(link)
                }
            })
            console.log(needToHighLightLink);
            renderRefresh();
            return;
        }


        //1.节点非空，连边空。
        //2.节点非空，连边非空，
        if (!linkOption.length) {
            //1.如果linkOption是空的，画完返回
            renderRefresh()
            return;
        } else {
            links.forEach(link => {
                if (
                    (linkOption.indexOf(`${link.source.role}-${link.target.role}`) >= 0 || linkOption.indexOf(`${link.target.role}-${link.source.role}`) >= 0) &&
                    (needToHighLightNodeIp.has(link.src_ip) && needToHighLightNodeIp.has(link.dst_ip))
                ) {
                    //这条link需要被高亮
                    needToHighLightLink.push(link)
                }
            })
            renderRefresh();
        }



        // //如果执行到这里，说明linkOption不是空的，或者area和role有一个不是空的

        // /**绘制高亮连边 */
        // const drawHighlightLinks = () => {
        //     links.forEach(link => {
        //         ctx.beginPath();
        //         const distance = Math.hypot(link.source.x - link.target.x, link.source.y - link.target.y);
        //         const newSourceNode = {
        //             x: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.x - link.target.x) + link.target.x,

        //             y: ((distance - SETTING.size.nodeRadius) / distance) * (link.source.y - link.target.y) + link.target.y,
        //         }
        //         const newTargetNode = {
        //             x: ((SETTING.size.nodeRadius + 0) / distance) *
        //                 (link.source.x - link.target.x) + link.target.x,
        //             y: ((SETTING.size.nodeRadius + 0) / distance) *
        //                 (link.source.y - link.target.y) + link.target.y,
        //         }
        //         ctx.moveTo(newSourceNode.x, newSourceNode.y);
        //         ctx.lineTo(newTargetNode.x, newTargetNode.y);

        //         if (needToHighLightLink.indexOf(link) >= 0) {
        //             ctx.strokeStyle = SETTING.fill.highlightLinkStroke;
        //             ctx.lineWidth = SETTING.size.highlightLinkStrokeWidth;
        //         } else {
        //             ctx.strokeStyle = SETTING.fill.stroke;
        //             ctx.lineWidth = SETTING.size.linkStrokeWidth;
        //         }
        //         ctx.stroke();

        //     })

        // }
        // const refreshHighlightLinks = () => {
        //     ctx.save();
        //     ctx.translate(transformObj.x, transformObj.y);
        //     ctx.scale(transformObj.k, transformObj.k);
        //     drawHighlightLinks();
        //     ctx.restore();
        // }


        // links.forEach(link => {
        //     if (
        //         (linkOption.indexOf(`${link.source.role}-${link.target.role}`) >= 0 || linkOption.indexOf(`${link.target.role}-${link.source.role}`) >= 0) &&
        //         (needToHighLightNodeIp.has(link.src_ip) && needToHighLightNodeIp.has(link.dst_ip))
        //     ) {
        //         //这条link需要被高亮
        //         needToHighLightLink.push(link)
        //     }
        // })
        // //绘制连边
        // refreshHighlightLinks()

    }



    /**
     * 专注模式
     * @param areaOption : 每个元素是一个数组，第一个元素是AZ，第二个元素是POD
     * @param roleOption : 用户选择角色的数组
     * @param linkOption : 用户选择连边类型的数组
     */
    const focusmode = (areaOption, roleOption, linkOption) => {

        const ctx = d3.select('#canvasNode').node().getContext('2d')
        const height = document.querySelector("#container").clientWidth
        const width = document.querySelector("#container").clientWidth

        needToHighLightNodeIp = new Set();

        if (areaOption[0] !== DEFAULT && areaOption.length > 0) {
            //如果用户选择了区域，就要进一步判断是否选择了role
            nodes.forEach(node => {
                if (areaOption.indexOf(`${node.az}_${node.pod_name}`) >= 0) {
                    if (roleOption[0] !== DEFAULT && roleOption.length > 0) {
                        //如果选了role，就加role满足条件的
                        if (roleOption.indexOf(`${node.role}`) >= 0) {
                            needToHighLightNodeIp.add(node.mgmt_ip)
                        }
                    } else {
                        //如果没选role，就把该区域中的节点全加入
                        needToHighLightNodeIp.add(node.mgmt_ip)
                    }

                }
            })
        } else if (roleOption[0] !== DEFAULT && roleOption.length > 0) {
            //如果用户没有选择区域，那么要只需要判断role
            nodes.forEach(node => {
                if (roleOption.indexOf(`${node.role}`) >= 0) {
                    needToHighLightNodeIp.add(node.mgmt_ip)
                }
            })
        } else {
            nodes.forEach(node => {
                needToHighLightNodeIp.add(node.mgmt_ip)
            })
            //area和option都是空的，添加全部节点
        }

        let needToDrawNodes = nodes.filter(node => needToHighLightNodeIp.has(node.mgmt_ip))
        let needToDrawLinks = []

        if (linkOption[0] === DEFAULT || linkOption.length === 0) {
            //linkOption是空的，全加
            needToDrawLinks = links.filter(link => {
                return ((needToHighLightNodeIp.has(link.src_ip) && (needToHighLightNodeIp.has(link.dst_ip))))
            })
        } else {
            //linksOption非空
            needToDrawLinks = [];
            needToDrawNodes = []//如果选了linksOption，那么所有的节点选择都会作废。以linksOption为主
            links.forEach(link => {
                if (linkOption.indexOf(`${link.source.role}-${link.target.role}`) >= 0 || linkOption.indexOf(`${link.target.role}-${link.source.role}`) >= 0) {
                    needToDrawLinks.push(link)
                    if (needToDrawNodes.indexOf(link.source) < 0) {
                        needToDrawNodes.push(link.source)
                    }
                    if (needToDrawNodes.indexOf(link.target) < 0) {
                        needToDrawNodes.push(link.target)
                    }
                }

            })

        }

        //needToDrawNodes, needToDrawLinks都是
        initCanvasByData(needToDrawNodes, needToDrawLinks)
    }



    return (
        <div className='canvasBox'>
            <p className='infoLabel'>
                节点数量:{datasource.nodes.length};
                连边数量:{datasource.links.length};
                告警节点数量:{datasource.nodes.filter(node => node.is_alarming).length};
                告警连边数量:{datasource.links.filter(link => link.is_alarming).length}

            </p>

            <div id="container" className='container'>
            </div>
        </div>
    )
}

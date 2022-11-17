
    //第一次加载
    // const initSvg = (datasource) => {
    //     d3.select('#container').select('*').remove()
    //     let data = handleData(datasource)

    //     //data
    //     const height = document.querySelector("#container").clientWidth
    //     const width = document.querySelector("#container").clientWidth
    //     const svgContainer = d3.select('#container').append('g')
    //         .attr('id', 'svgContainer')
    //         .attr('class', 'svgContainer')
    //     const svg = svgContainer.append('svg')
    //         .attr('id', 'svgNode')
    //         .attr('class', 'svgNode')
    //         .attr('height', height)
    //         .attr('width', width)

    //     // let nodes = data.nodes.map(node => ({ ...node }))
    //     // let links = data.links.map(link => ({ ...link }))
    //     let nodes = { ...data.nodes }
    //     let links = { ...data.links }


    //     let nodesContainer = d3.select('#svgNode').append('g')
    //         .attr('id', 'nodesContainer')

    //     //一个node的容器，为了方便后续加text
    //     let nodeG = nodesContainer.selectAll('nodesgroup')
    //         .data(nodes)
    //         .enter()
    //         .append('g')
    //         .attr('id', d => d.role)

    //     let nodeCircle = nodeG.append('circle')
    //         .attr('id', d => d.mgmt_ip)
    //         .attr('class', 'node')
    //         .attr('r', SETTING.size.nodeRadius)
    //         .attr('fill', d => SETTING.fill[d.role])

    //     let linksContainer = svg.append('g')
    //         .attr('id', 'linksContainer')

    //     let link = linksContainer.selectAll('.link')
    //         .data(links)
    //         .enter()
    //         .append("line")
    //         .attr('class', 'link')
    //         .attr('stroke', SETTING.fill.stroke)
    //         .attr('stroke-width', SETTING.size.linkStrokeWidth)

    //     const ticked = () => {
    //         link.attr("x1", function (d) { return parseInt(d.source.x); })
    //             .attr("y1", function (d) { return parseInt(d.source.y); })
    //             .attr("x2", function (d) { return parseInt(d.target.x); })
    //             .attr("y2", function (d) { return parseInt(d.target.y); });

    //         nodeCircle.attr("cx", function (d) { return parseInt(d.x); })
    //             .attr("cy", function (d) { return parseInt(d.y); });
    //     }

    //     let simulation = d3.forceSimulation(nodes)
    //         .force("charge", d3.forceManyBody().strength(-80))
    //         .force("center", d3.forceCenter(width / 4, height / 4))
    //         .force("collide", d3.forceCollide().radius(10).strength(0.8))
    //         //设定forceX与forceY使得它们更加聚拢在中间位置
    //         .force("x", d3.forceX(width / 2).strength(0.15))
    //         .force("y", d3.forceY(height / 2).strength(0.15))
    //         .force("link", d3.forceLink(links).id(d => {
    //             return d.mgmt_ip
    //         }).strength(0.5).distance(10))
    //         .on("tick", ticked)
    // }

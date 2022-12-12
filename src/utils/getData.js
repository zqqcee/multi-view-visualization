//原始数据
import case1 from "../assets/nodealarming/case1.json"
import case2 from "../assets/nodealarming/case2.json"
import case3 from "../assets/linkalarming/link_alarming.json"
//结构2
import structure2 from "../assets/struct2/struct2.json"
//结构3
import structure3 from "../assets/struct3/struct3.json"
//结构4
import structure4 from "../assets/struct4/struct4.json"


//等比缩放
import small1 from "../assets/ratioscale/小规模数据1 511节点 402边 删除pod -6核心pod.json"
import small2 from "../assets/ratioscale/小规模数据2 474节点 266边 删除pod -6核心pod.json"
import middle1 from "../assets/ratioscale/中规模数据1 1569节点 1380边 删除pod -1核心pod.json"
import middle2 from "../assets/ratioscale/中规模数据2 1712节点 1499边 删除pod -3核心pod.json"
import large1 from "../assets/ratioscale/大规模数据1 2160节点 2273边 删除pod -1核心pod.json"
import large2 from "../assets/ratioscale/大规模数据2 2595节点 2277边 删除pod -3核心pod.json"



export default function generate() {

    const datasets = {
        case1,
        case2,
        case3,
        structure2,
        structure3,
        structure4,
        small1,
        small2,
        middle1,
        middle2,
        large1,
        large2,
    }

    return datasets;
}

export const dataSets = generate();
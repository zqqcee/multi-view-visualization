import case1 from "../assets/nodealarming/case1.json"
import case2 from "../assets/nodealarming/case2.json"


import case3 from "../assets/linkalarming/link_alarming.json"
//结构2
import case4 from "../assets/struct2/case4_struc2.json"


//等比缩放
import case5 from "../assets/ratioscale/小规模数据1 511节点 402边 删除pod -6核心pod.json"
import case6 from "../assets/ratioscale/小规模数据2 474节点 266边 删除pod -6核心pod.json"
import case7 from "../assets/ratioscale/中规模数据1 1569节点 1380边 删除pod -1核心pod.json"
import case8 from "../assets/ratioscale/中规模数据2 1712节点 1499边 删除pod -3核心pod.json"
import case9 from "../assets/ratioscale/大规模数据1 2160节点 2273边 删除pod -1核心pod.json"
import case10 from "../assets/ratioscale/大规模数据2 2595节点 2277边 删除pod -3核心pod.json"


export default function generate() {

    const datasets = {
        case1,
        case2,
        case3,
        case4,
        case5,
        case6,
        case7,
        case8,
        case9,
        case10,
    }

    return datasets;
}

export const dataSets = generate();
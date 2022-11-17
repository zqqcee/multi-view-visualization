import case1 from "../assets/rate001s.json"
import case2 from "../assets/rate001.json"
import case3 from "../assets/link_alarming.json"




export default function generate() {

    const datasets = {
        case1,
        case2,
        case3
    }

    return datasets;
}

export const dataSets = generate();
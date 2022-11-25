export const SETTING = {
    size: {
        nodeRadius: 10,
        highlightNodeRadius: 6,
        linkStrokeWidth: 1,
        highlightLinkStrokeWidth: 1,
        symbolSize: 100
    },
    fill: {
        normalNode: "#0e93e1",
        alarmingNode: "red",
        stroke: "#6c757d",
    },
    alarming: {
        node: {
            fill: 'red',
            radius: 15,
            flag: true,//全局开关
        },
        link: {
            stroke: 'red',
            strokeWidth: 4,
            flag: true,//全局开关
        }
    },
    dragMode: {
        flag: true //默认不移动
    }

}
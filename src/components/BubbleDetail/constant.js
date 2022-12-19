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
    opacityFill: {
        'core': "#2ca02c80",
        'spine': "#1f77b480",
        'leaf': "#ff7f0e80",
        'server': "#9467bd80",
        'virtual': "#9467bd80",
        'default': "#bcb8b180"
    },
    hypernode: {
        fill: '#ededed',
        stroke: '#b6dad3',
        strokewidth: '1',
        dasharray: '10 0.5',
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
        flag: false //默认不移动
    }

};

export const FUZZYSEG = 'fuzzyseg';
export const SEG = 'seg';
export const DBSCAN = 'dbscan';
export const TARJAN = 'tarjan';
export const ORIGIN = 'origin'
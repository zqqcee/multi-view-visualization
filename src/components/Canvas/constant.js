export const SETTING = {
    size: {
        nodeRadius: 5,
        highlightNodeRadius: 6,
        linkStrokeWidth: .3,
        highlightLinkStrokeWidth: 2
    },
    fill: {
        // 'core': "#00296b",
        // 'spine': "#386641",
        // 'leaf': "#7cb518",
        // 'server': "#ffb4a2",
        // 'virtual': "#ffb4a2",
        'core': "#3f6600",
        'spine': "#002c8c",
        'leaf': "#91caff",
        'server': "#08979c",
        'virtual': "#08979c",
        "stroke": "#6c757d",

        highlightLinkStroke: "#01161e"
    },
    opacityFill: {
        'core': "#2ca02c80",
        'spine': "#1f77b480",
        'leaf': "#ff7f0e80",
        'server': "#9467bd80",
        'virtual': "#9467bd80",
        'default': "#bcb8b180"
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
    }

}
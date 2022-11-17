
const CracoLessPlugin = require('craco-less');
module.exports = {
    babel: {
        plugins: [
            ['import', { libraryName: 'antd', style: true }], // 按需加载
        ]
    },

    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
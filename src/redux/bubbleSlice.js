import { createSlice } from "@reduxjs/toolkit";


/**data option */
export const bubbleSlice = createSlice({
    name: 'bubble',
    initialState: {
        areaInfo: '',
        drawInfo: {}, //绘图数据
        detail: {}, //展示数据，包含节点，连边，告警点，告警边
        ratio: 0, //压缩率,后端返回
        cutRatio: 0.8, //剪枝率
        similarityThreshold: 0.8,//相似度阈值，即压缩强度
    },
    reducers: {
        //选择信息（hover的区域）
        changeAreaInfo: ((state, action) => {
            state.areaInfo = action.payload.areaInfo
        }),
        //绘制信息（click的区域）
        changeDrawInfo: ((state, action) => {
            state.drawInfo = action.payload.drawInfo
        }),
        //click选择的区域的具体信息
        changeDetail: ((state, action) => {
            state.detail = action.payload.detail
        }),
        //压缩率，后端返回
        changeRatio: ((state, action) => {
            state.ratio = action.payload.ratio
        }),
        //剪枝率
        changeCutRatio: ((state, action) => {
            state.cutRatio = action.payload.cutRatio
        }),
        //相似度阈值，即压缩强度
        changeSimilarityThreshold: ((state, action) => {
            state.similarityThreshold = action.payload.similarityThreshold
        }),
    }
})


export const { changeAreaInfo, changeDrawInfo, changeDetail, changeRatio, changeCutRatio, changeSimilarityThreshold } = bubbleSlice.actions
export default bubbleSlice.reducer
import { createSlice } from "@reduxjs/toolkit";


/**data option */
export const bubbleSlice = createSlice({
    name: 'bubble',
    initialState: {
        areaInfo: '',
        drawInfo: {}, //绘图数据
        detail: {}, //展示数据，包含节点，连边，告警点，告警边
        ratio: 0, //压缩率
    },
    reducers: {
        changeAreaInfo: ((state, action) => {
            state.areaInfo = action.payload.areaInfo
        }),
        changeDrawInfo: ((state, action) => {
            state.drawInfo = action.payload.drawInfo
        }),
        changeDetail: ((state, action) => {
            state.detail = action.payload.detail
        }),
        changeRatio: ((state, action) => {
            state.ratio = action.payload.ratio
        }),
    }
})


export const { changeAreaInfo, changeDrawInfo, changeDetail, changeRatio } = bubbleSlice.actions
export default bubbleSlice.reducer
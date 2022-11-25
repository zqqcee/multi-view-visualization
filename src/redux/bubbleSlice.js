import { createSlice } from "@reduxjs/toolkit";


/**data option */
export const bubbleSlice = createSlice({
    name: 'bubble',
    initialState: {
        areaInfo: '',
        drawInfo: {} //绘图数据
    },
    reducers: {
        changeAreaInfo: ((state, action) => {
            state.areaInfo = action.payload.areaInfo
        }),
        changeDrawInfo: ((state, action) => {
            state.drawInfo = action.payload.drawInfo
        }),
    }
})


export const { changeAreaInfo, changeDrawInfo } = bubbleSlice.actions
export default bubbleSlice.reducer
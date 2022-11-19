import { createSlice } from "@reduxjs/toolkit";


/**data option */
export const dataInfoSlice = createSlice({
    name: 'dataInfo',
    initialState: {
        highlightNodeNum: 0,
        highlightLinkNum: 0,
        detailInfo:{nodes:{},links:{},area:{}}
    },
    reducers: {
        changeDataInfo: ((state, action) => {
            state.highlightNodeNum = action.payload.highlightNodeNum
            state.highlightLinkNum = action.payload.highlightLinkNum
            state.detailInfo = action.payload.detailInfo
        }),
    }
})


export const { changeDataInfo } = dataInfoSlice.actions
export default dataInfoSlice.reducer
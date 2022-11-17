import { createSlice } from "@reduxjs/toolkit";


/**data option */
export const dataInfoSlice = createSlice({
    name: 'dataInfo',
    initialState: {
        highlightNodeNum: 0,
        highlightLinkNum: 0
    },
    reducers: {
        changeDataInfo: ((state, action) => {
            state.highlightNodeNum = action.payload.highlightNodeNum
            state.highlightLinkNum = action.payload.highlightLinkNum
        }),
    }
})


export const { changeDataInfo } = dataInfoSlice.actions
export default dataInfoSlice.reducer
import { createSlice } from "@reduxjs/toolkit";


/** searchView users' search Info */
export const searchInfoSlice = createSlice({
    name: 'searchInfo',
    initialState: {
        value: "",
        twoHopFlag: false,
        highlightFlag: false
    },
    reducers: {
        search: ((state, action) => {
            state.value = action.payload.value
        }),
        changeSearchMode: ((state, action) => {
            state.twoHopFlag = action.payload.twoHopFlag
        }),
        changeHighlightFlag: ((state, action) => {
            state.highlightFlag = action.payload.highlightFlag
        }),
    }
})


export const { search, changeSearchMode, changeHighlightFlag } = searchInfoSlice.actions
export default searchInfoSlice.reducer
import { createSlice } from "@reduxjs/toolkit";


/** searchView users' search Info */
export const searchInfoSlice = createSlice({
    name: 'searchInfo',
    initialState: {
        num: 0,
        alarmingNum: 0,
        value: "",
        oneHopFlag: false,
        twoHopFlag: false,
        allOneHopFlag: false,
        allTwoHopFlag: false,
        highlightFlag: false,
    },
    reducers: {
        searchNum: ((state, action) => {
            state.num = action.payload
        }),
        searchAlarmingNum: ((state, action) => {
            state.alarmingNum = action.payload
        }),
        search: ((state, action) => {
            state.value = action.payload.value
        }),
        changeAllSearchMode1: ((state, action) => {
            state.allOneHopFlag = action.payload.allOneHopFlag
        }),
        changeAllSearchMode2: ((state, action) => {
            state.allTwoHopFlag = action.payload.allTwoHopFlag
        }),
        changeSearchMode1: ((state, action) => {
            state.oneHopFlag = action.payload.oneHopFlag
        }),
        changeSearchMode2: ((state, action) => {
            state.twoHopFlag = action.payload.twoHopFlag
        }),
        changeHighlightFlag: ((state, action) => {
            state.highlightFlag = action.payload.highlightFlag
        }),
    }
})


export const { searchNum, searchAlarmingNum, search, changeAllSearchMode1, changeAllSearchMode2, changeSearchMode1, changeSearchMode2, changeHighlightFlag } = searchInfoSlice.actions
export default searchInfoSlice.reducer
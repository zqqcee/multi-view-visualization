import { createSlice } from "@reduxjs/toolkit";
import { FOCUS, HIGHLIGHT } from "./constant";


/**data option */
export const optionSlice = createSlice({
    name: 'option',
    initialState: {
        dataName: "case1",
        mode: HIGHLIGHT

    },
    reducers: {
        changedata: ((state, action) => {
            //action.payload是我们传进来的值
            //这里的state是一个proxy对象，直接修改即可
            state.dataName = action.payload
        }),
        changemode: ((state, action) => {
            state.mode = action.payload
        })
    }
})


export const { changedata, changemode } = optionSlice.actions
export default optionSlice.reducer
import { createSlice } from "@reduxjs/toolkit";


/** searchView users' search Info */
export const modeFlagSlice = createSlice({
    name: 'modeFlag',
    initialState: {
        flag: false
    },
    reducers: {
        changeModeFlag: ((state, action) => {
            state.flag = action.payload.flag
        })
    }
})


export const { changeModeFlag } = modeFlagSlice.actions
export default modeFlagSlice.reducer
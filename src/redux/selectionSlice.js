import { createSlice } from "@reduxjs/toolkit";


/** area，role，link selection */
export const selectionSlice = createSlice({
    name: 'selection',
    initialState: {
        area: [],
        role: [],
        link: [],

    },
    reducers: {
        areaoption: ((state, action) => {
            state.area = action.payload
        }),
        roleoption: ((state, action) => {
            state.role = action.payload
        }),
        linkoption: ((state, action) => {
            state.link = action.payload
        }),
    }
})


export const { areaoption, roleoption, linkoption } = selectionSlice.actions
export default selectionSlice.reducer
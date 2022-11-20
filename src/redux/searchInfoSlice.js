import { createSlice } from "@reduxjs/toolkit";


/** searchView users' search Info */
export const searchInfoSlice = createSlice({
    name: 'searchInfo',
    initialState: {
        value: ""
    },
    reducers: {
        search: ((state, action) => {
            state.value = action.payload.value
        })
    }
})


export const { search } = searchInfoSlice.actions
export default searchInfoSlice.reducer
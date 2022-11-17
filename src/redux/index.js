// import { optionReducer } from "./optionReducer"
// import { selectionReducer } from "./selectionReducer"
import optionReducer from './optionSlice';
import selectionReducer from "./selectionSlice"

export const reducers = {
    option: optionReducer,
    selection: selectionReducer
}
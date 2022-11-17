// import { optionReducer } from "./optionReducer"
// import { selectionReducer } from "./selectionReducer"
import optionReducer from './optionSlice';
import selectionReducer from "./selectionSlice"
import dataInfoReducer from "./dataInfoSlice"

export const reducers = {
    option: optionReducer,
    selection: selectionReducer,
    dataInfo: dataInfoReducer
}
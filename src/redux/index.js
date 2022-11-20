// import { optionReducer } from "./optionReducer"
// import { selectionReducer } from "./selectionReducer"
import optionReducer from './optionSlice';
import selectionReducer from "./selectionSlice"
import dataInfoReducer from "./dataInfoSlice"
import searchInfoReducer from "./searchInfoSlice"

export const reducers = {
    option: optionReducer,
    selection: selectionReducer,
    dataInfo: dataInfoReducer,
    searchInfo: searchInfoReducer
}
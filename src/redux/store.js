import { configureStore } from '@reduxjs/toolkit'
import { reducers } from './index';



export const store = configureStore(
    {
        reducer: reducers,
    }

);

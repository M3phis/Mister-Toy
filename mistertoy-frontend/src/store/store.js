import { configureStore } from '@reduxjs/toolkit'
import toyReducer from './toy.slice'

export const store = configureStore({
    reducer: {
        toyModule: toyReducer,
    },
}) 
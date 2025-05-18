import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toyService } from '../services/toy.service'

export const loadToys = createAsyncThunk(
    'toy/loadToys',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { toyModule } = getState()
            const toys = await toyService.query(toyModule.filterBy)
            return toys
        } catch (err) {
            return rejectWithValue('Failed to load toys')
        }
    }
)

export const saveToy = createAsyncThunk(
    'toy/saveToy',
    async (toy, { rejectWithValue }) => {
        try {
            const savedToy = await toyService.save(toy)
            return savedToy
        } catch (err) {
            return rejectWithValue('Failed to save toy')
        }
    }
)

export const removeToy = createAsyncThunk(
    'toy/removeToy',
    async (toyId, { rejectWithValue }) => {
        try {
            await toyService.remove(toyId)
            return toyId
        } catch (err) {
            return rejectWithValue('Failed to remove toy')
        }
    }
)

const initialState = {
    toys: [],
    isLoading: false,
    error: null,
    filterBy: toyService.getDefaultFilter()
}

const toySlice = createSlice({
    name: 'toy',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            const newFilter = { ...state.filterBy, ...action.payload }
            if (JSON.stringify(newFilter) !== JSON.stringify(state.filterBy)) {
                state.filterBy = newFilter
            }
        },
        setLoading: (state, action) => {
            if (state.isLoading !== action.payload) {
                state.isLoading = action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadToys.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loadToys.fulfilled, (state, action) => {
                const newToys = action.payload
                const currentToys = JSON.stringify(state.toys)
                const incomingToys = JSON.stringify(newToys)

                if (currentToys !== incomingToys) {
                    state.toys = newToys
                }
                state.isLoading = false
            })
            .addCase(loadToys.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(saveToy.fulfilled, (state, action) => {
                const idx = state.toys.findIndex(t => t._id === action.payload._id)
                if (idx !== -1) {
                    if (JSON.stringify(state.toys[idx]) !== JSON.stringify(action.payload)) {
                        state.toys[idx] = action.payload
                    }
                } else {
                    state.toys.push(action.payload)
                }
            })
            .addCase(removeToy.fulfilled, (state, action) => {
                state.toys = state.toys.filter(t => t._id !== action.payload)
            })
    }
})

export const { setFilter, setLoading } = toySlice.actions
export default toySlice.reducer 
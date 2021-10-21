import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    LocationData,
    getData,
    replaceUrlsWithIds,
} from '../../lib/apiCall';
import { BaseState } from './Interfaces';

const initialState = {
    requestInfo: {
        status: '',
        err: '',
        curId: ''
    },
    data: [],
    info: {
        count: 0,
        pages: 0,
        next: '',
        prev: ''
    }
} as BaseState<LocationData>;


export const getLocationsById = createAsyncThunk<
    LocationData[],
    number[],
    { rejectValue: Error }
>(
    'locations/getById',
    async (userId: number[], thunkAPI) => {
        try {
            const response = await getData('location', userId);
            return replaceUrlsWithIds('location', response);
        } catch (err) {
            return thunkAPI.rejectWithValue(err as Error);
        }
    }
)

const locationsSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getLocationsById.fulfilled, (state, action) => {
            state.data = action.payload;
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getLocationsById.pending, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getLocationsById.rejected, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: action.error.message + '',
                curId: action.meta.requestId
            }

        })
    }
})
export const { } = locationsSlice.actions;
export default locationsSlice.reducer;

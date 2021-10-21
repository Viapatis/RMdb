import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    CharacterData,
    getData,
    replaceUrlsWithIds,
} from '../../lib/apiCall';
import { BaseState } from './interfaces';
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
} as BaseState<CharacterData>
export const getCharactersById = createAsyncThunk<
    CharacterData[],
    number[],
    { rejectValue: Error }
>(
    'characters/getByIds',
    async (userIds: number[], thunkAPI) => {
        try {
            const response = await getData('character', userIds);
            return replaceUrlsWithIds('character', response);
        } catch (err) {
            return thunkAPI.rejectWithValue(err as Error);
        }
    }
)
const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getCharactersById.fulfilled, (state, action) => {
            state.data = action.payload;
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getCharactersById.pending, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getCharactersById.rejected, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: action.error.message + '',
                curId: action.meta.requestId
            }

        })
    }
})
export const { } = charactersSlice.actions;
export default charactersSlice.reducer;
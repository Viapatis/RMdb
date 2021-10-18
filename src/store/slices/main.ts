import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import PROJECT_INFO from '../../projectDef'
import {
    LocationData,
    CharacterData,
    EpisodeData,
    getData,
    replaceUrlsWithIds,
    QueryParams,
    getQueryType,
    InfoWrap,
    QueryType
} from '../../lib/apiCall'

export interface MainState extends Pick<InfoWrap<void>, 'info'> {
    locations: LocationData[],
    characters: CharacterData[],
    episodes: EpisodeData[],
    requestInfo: {
        status: string,
        err: string,
        curId: string
    }
    projectInfo: typeof PROJECT_INFO
}
const initialState = {
    locations: [],
    characters: [],
    episodes: [],
    info: {
        count: 0,
        pages: 0,
        next: '',
        prev: ''
    }
    , requestInfo: {
        status: '',
        err: '',
        curId: ''
    },
    projectInfo: PROJECT_INFO
} as MainState;

export const getCharactersById = createAsyncThunk<
    CharacterData[],
    number[],
    { rejectValue: Error }
>(
    'main/fetchCharactersById',
    async (userId: number[], thunkAPI) => {
        try {
            const response = await getData('character', userId);
            return response.map(charData => replaceUrlsWithIds('character', charData));
        } catch (err) {
            return thunkAPI.rejectWithValue(err as Error);
        }
    }
)
export const getLocationsById = createAsyncThunk<
    LocationData[],
    number[],
    { rejectValue: Error }
>(
    'main/fetchLocationById',
    async (userId: number[], thunkAPI) => {
        try {
            const response = await getData('location', userId);
            return response.map(charData => replaceUrlsWithIds('location', charData));
        } catch (err) {
            return thunkAPI.rejectWithValue(err as Error);
        }
    }
)

export const getEpisodes = createAsyncThunk<
    {
        type: QueryType,
        response: EpisodeData | EpisodeData[] | InfoWrap<EpisodeData>
    },
    QueryParams,
    { rejectValue: Error }
>(
    'main/fetchEpisodes',
    async (query: QueryParams, thunkAPI) => {
        try {
            const type = getQueryType(query) as QueryType;
            const response = await getData('episode', query);
            return { type: type, response: response };
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err as Error);
        }
    }
)

const counterSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getCharactersById.fulfilled, (state, action) => {
            state = {
                ...state,
                characters: action.payload,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: '',
                    curId: action.meta.requestId
                }
            }
        })
        builder.addCase(getCharactersById.pending, (state, action) => {
            state = {
                ...state,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: '',
                    curId: action.meta.requestId
                }
            }
        })
        builder.addCase(getCharactersById.rejected, (state, action) => {
            state = {
                ...state,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: action.error.message!,
                    curId: action.meta.requestId
                }
            }
        })
        builder.addCase(getLocationsById.fulfilled, (state, action) => {
            state = { ...state, locations: action.payload }
        })
        builder.addCase(getLocationsById.pending, (state, action) => {
            state = {
                ...state,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: '',
                    curId: action.meta.requestId
                }
            }
        })
        builder.addCase(getLocationsById.rejected, (state, action) => {
            state = {
                ...state,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: action.error.message!,
                    curId: action.meta.requestId
                }
            }
        })
        builder.addCase(getEpisodes.fulfilled, (state, action) => {
            const { type, response } = action.payload;
            if (type === 'array')
                state = { ...state, episodes: response as EpisodeData[] }
            if (type === 'filtring-object')
                state = {
                    ...state,
                    episodes: (response as InfoWrap<EpisodeData>).results,
                    info: (response as InfoWrap<EpisodeData>).info
                }
            if (type === 'single')
                state = { ...state, episodes: [response as EpisodeData] }
        })
        builder.addCase(getEpisodes.pending, (state, action) => {
            state = {
                ...state,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: '',
                    curId: action.meta.requestId
                }
            }
        })
        builder.addCase(getEpisodes.rejected, (state, action) => {
            state = {
                ...state,
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: action.error.message!,
                    curId: action.meta.requestId
                }
            }
        })
    }
})
export const { } = counterSlice.actions;
export default counterSlice.reducer;
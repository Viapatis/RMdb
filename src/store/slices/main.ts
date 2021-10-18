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
interface RequestWrap<T> {
    info: {
        status: string,
        err: string,
        curId: string
    }
    data: T
}
export interface MainState extends Pick<InfoWrap<void>, 'info'> {
    locations: RequestWrap<LocationData[]>,
    characters: RequestWrap<CharacterData[]>,
    episodes: RequestWrap<EpisodeData[]>,
    projectInfo: typeof PROJECT_INFO
}
const initialState = {
    locations: {
        info: {
            status: '',
            err: '',
            curId: ''
        },
        data: []
    },
    characters: {
        info: {
            status: '',
            err: '',
            curId: ''
        },
        data: []
    },
    episodes: {
        info: {
            status: '',
            err: '',
            curId: ''
        },
        data: []
    },
    info: {
        count: 0,
        pages: 0,
        next: '',
        prev: ''
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
            return replaceUrlsWithIds('character', response);
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
            return replaceUrlsWithIds('location', response);
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
                characters: {
                    data: action.payload,
                    info: {
                        status: action.meta.requestStatus,
                        err: '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getCharactersById.pending, (state, action) => {
            state = {
                ...state,
                characters: {
                    data: [],
                    info: {
                        status: action.meta.requestStatus,
                        err: '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getCharactersById.rejected, (state, action) => {
            state = {
                ...state,
                characters: {
                    data: [],
                    info: {
                        status: action.meta.requestStatus,
                        err: action.error.message + '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getLocationsById.fulfilled, (state, action) => {
            state = {
                ...state,
                locations: {
                    data: action.payload,
                    info: {
                        status: action.meta.requestStatus,
                        err: '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getLocationsById.pending, (state, action) => {
            state = {
                ...state,
                locations: {
                    data: [],
                    info: {
                        status: action.meta.requestStatus,
                        err: '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getLocationsById.rejected, (state, action) => {
            state = {
                ...state,
                locations: {
                    data: [],
                    info: {
                        status: action.meta.requestStatus,
                        err: action.error.message + '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getEpisodes.fulfilled, (state, action) => {
            const { type, response } = action.payload;
            let newEpisodeParams = {
                episodes: {
                    data: [] as EpisodeData[],
                    info: {
                        status: action.meta.requestStatus,
                        err: '',
                        curId: action.meta.requestId
                    }
                }
            } as { episodes: RequestWrap<EpisodeData[]>, info?: InfoWrap<EpisodeData>['info'] }
            if (type === 'array')
                newEpisodeParams.episodes.data = response as EpisodeData[];
            if (type === 'filtring-object') {
                newEpisodeParams.episodes.data = (response as InfoWrap<EpisodeData>).results;
                newEpisodeParams.info = (response as InfoWrap<EpisodeData>).info as InfoWrap<EpisodeData>['info'];
            }
            if (type === 'single')
                newEpisodeParams.episodes.data = [response as EpisodeData]
            newEpisodeParams.episodes.data = replaceUrlsWithIds('episode', newEpisodeParams.episodes.data);
            state = {
                ...state,
                ...newEpisodeParams
            }
        })
        builder.addCase(getEpisodes.pending, (state, action) => {
            state = {
                ...state,
                episodes: {
                    data: [],
                    info: {
                        status: action.meta.requestStatus,
                        err: '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
        builder.addCase(getEpisodes.rejected, (state, action) => {
            state = {
                ...state,
                episodes: {
                    data: [],
                    info: {
                        status: action.meta.requestStatus,
                        err: action.error.message + '',
                        curId: action.meta.requestId
                    }
                }
            }
        })
    }
})
export const { } = counterSlice.actions;
export default counterSlice.reducer;
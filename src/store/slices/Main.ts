import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EpisodeData, CharacterData, LocationData, EpisodeFilters, QueryParams, InfoWrap, Info } from '../../lib/apiTypes'
import { replaceUrls, checkInfo } from '../../lib/tools'
import api from '../../lib/api'
export interface MainState {
    loadAllowed: boolean,
    episodes: EpisodeData[],
    characters: CharacterData[],
    locations: LocationData[],
    requestInfo: {
        status: string,
        err: string,
        curId: string
    }
    info: Info
}
const initialState = {
    loadAllowed: true,
    episodes: [],
    characters: [],
    locations: [],
    requestInfo: {
        status: '',
        err: '',
        curId: ''
    },
    info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null
    }
} as MainState;

export const getEpisodesByFilter = createAsyncThunk<
    InfoWrap<EpisodeData>,
    EpisodeFilters | undefined,
    { rejectValue: string }
>(
    'main/getEpisodesByFilter',
    async (params: EpisodeFilters | undefined, thunkAPI) => {
        try {
            const response = await api.getEpisodesByFilter(params);
            replaceUrls(response);
            return response;
        }
        catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
)
export const getEpisodeWithCharacters = createAsyncThunk<
    { episode: EpisodeData, characters: CharacterData[] },
    number,
    { rejectValue: string }
>(
    'main/getEpisodeWithCharacters',
    async (id: number, thunkAPI) => {
        try {
            const episode = await api.getEpisodeById(id);
            replaceUrls(episode);
            const characters = await api.getCharactersByIds(episode.characters as number[]);
            return { episode: episode, characters: characters };
        }
        catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
)
export const getCharactersWithLocation = createAsyncThunk<
    { charcater: CharacterData, location: LocationData },
    number,
    { rejectValue: string }
>(
    'main/getCharactersWithLocation',
    async (id: number, thunkAPI) => {
        try {
            const charcater = await api.getCharacterById(id);
            replaceUrls(charcater);
            const location = await api.getLocationById(charcater.location.url as number);
            replaceUrls(location);
            return { charcater: charcater, location: location };
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
)

export const getLocationsWithCharacters = createAsyncThunk<
    { charcaters: CharacterData[], location: LocationData },
    number,
    { rejectValue: string }
>(
    'main/getLocationsWithCharacters',
    async (id: number, thunkAPI) => {
        try {
            const location = await api.getLocationById(id);
            replaceUrls(location);
            const characters = await api.getCharactersByIds(location.residents as number[]);

            return { charcaters: characters, location: location };
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
)

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setLoadAllowed(state, action: PayloadAction<boolean>) {
            state.loadAllowed = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getEpisodesByFilter.fulfilled, (state, action) => {
            const response = action.payload;
            state.episodes = checkInfo({...state.info}, response.info) ?
                [...state.episodes, ...response.results] :
                [...response.results];
            state.info = response.info;
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            };
        })
        builder.addCase(getEpisodesByFilter.pending, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getEpisodesByFilter.rejected, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: action.payload ? action.payload : action.error.message + '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getCharactersWithLocation.fulfilled, (state, action) => {
            state.characters = [action.payload.charcater];
            state.locations = [action.payload.location];
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getCharactersWithLocation.pending, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getCharactersWithLocation.rejected, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: action.payload ? action.payload : action.error.message + '',
                curId: action.meta.requestId
            }

        })
        builder.addCase(getLocationsWithCharacters.fulfilled, (state, action) => {
            state.locations = [action.payload.location];
            state.characters = action.payload.charcaters;
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getLocationsWithCharacters.pending, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getLocationsWithCharacters.rejected, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: action.payload ? action.payload : action.error.message + '',
                curId: action.meta.requestId
            }

        })
        builder.addCase(getEpisodeWithCharacters.fulfilled, (state, action) => {
            state.episodes = [action.payload.episode];
            state.characters = action.payload.characters;
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getEpisodeWithCharacters.pending, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: '',
                curId: action.meta.requestId
            }
        })
        builder.addCase(getEpisodeWithCharacters.rejected, (state, action) => {
            state.requestInfo = {
                status: action.meta.requestStatus,
                err: action.payload ? action.payload : action.error.message + '',
                curId: action.meta.requestId
            }

        })
    }
})
export const { setLoadAllowed } = mainSlice.actions;
export default mainSlice.reducer;
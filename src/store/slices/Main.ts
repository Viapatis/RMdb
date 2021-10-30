import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EpisodeData, CharacterData, LocationData, InfoWrap, Info, FilterParams } from '../../lib/apiTypes'
import { replaceUrls, checkInfo } from '../../lib/tools'
import api from '../../lib/api'
export interface MainState {
    pageLoadAllowed: boolean,
    episodes: EpisodeData[],
    characters: CharacterData[],
    locations: LocationData[],
    episode: EpisodeData | null,
    character: CharacterData | null,
    location: LocationData | null,
    requestInfo: {
        status: string,
        err: string,
        curId: string
    }
    info: Info,
    urlSerch: FilterParams
}
const initialState = {
    pageLoadAllowed: true,
    episodes: [],
    characters: [],
    locations: [],
    episode: null,
    character: null,
    location: null,
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
    },
    urlSerch: {}
} as MainState;

export const getEpisodesByFilter = createAsyncThunk<
    InfoWrap<EpisodeData>,
    FilterParams | undefined,
    { rejectValue: string }
>(
    'main/getEpisodesByFilter',
    async (params: FilterParams | undefined, thunkAPI) => {
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
            replaceUrls(characters);
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
            replaceUrls(characters);
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
        setUrlSerch(state, action: PayloadAction<FilterParams>) {
            state.urlSerch = action.payload;
        },
        clearRecivedData(state, action: PayloadAction<undefined>) {
            state.characters = [];
            state.locations = [];
            state.episodes = []
            state.character = null;
            state.location = null;
            state.episode = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getEpisodesByFilter.fulfilled, (state, action) => {
            const response = action.payload;
            state.pageLoadAllowed = true;
            state.episodes = checkInfo({ ...state.info }, response.info) ?
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
            state.character = action.payload.charcater;
            state.location = action.payload.location;
            state.pageLoadAllowed = false;
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
            state.location = action.payload.location;
            state.characters = action.payload.charcaters;
            state.pageLoadAllowed = false;
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
            state.episode = action.payload.episode;
            state.characters = action.payload.characters;
            state.pageLoadAllowed = false;
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
export const { setUrlSerch, clearRecivedData } = mainSlice.actions
export default mainSlice.reducer;
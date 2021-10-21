import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    LocationData,
    CharacterData,
    EpisodeData,
    getData,
    replaceUrlsWithIds,
    QueryParams,
    getQueryType,
    InfoWrap,
    QueryType,
    checkInfo
} from '../../lib/apiCall'
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
} as BaseState<EpisodeData>
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

export const getEpisodes = createAsyncThunk<
    {
        type: QueryType,
        response: EpisodeData | EpisodeData[] | InfoWrap<EpisodeData>,
        oldData?: EpisodeData[]
    },
    { episodesData?: EpisodeData[], params?: QueryParams },
    { rejectValue: Error }
>(
    'episodes/get',
    async ({ params, episodesData }, thunkAPI) => {
        try {
            const type = getQueryType(params) as QueryType;
            const response = await getData('episode', params);
            if (episodesData)
                if (episodesData.length)
                    return { type: type, response: response, oldData: episodesData };
            return { type: type, response: response }
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err as Error);
        }
    }
)

const episodesSlice = createSlice({
    name: 'episodes',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getEpisodes.fulfilled, (state, action) => {
            const { type, response, oldData } = action.payload;
            let newEpisodeParams = {
                data: [] as EpisodeData[],
                requestInfo: {
                    status: action.meta.requestStatus,
                    err: '',
                    curId: action.meta.requestId
                }
            } as BaseState<EpisodeData>
            if (type === 'array')
                newEpisodeParams.data = response as EpisodeData[];
            if (type === 'filtring-object') {
                const { results, info } = response as InfoWrap<EpisodeData>;
                newEpisodeParams.data = results;
                newEpisodeParams.info = info;
            }
            if (type === 'single')
                newEpisodeParams.data = [response as EpisodeData]
            newEpisodeParams.data = replaceUrlsWithIds('episode', newEpisodeParams.data);
            if ('info' in newEpisodeParams) {
                if (checkInfo(state.info, newEpisodeParams.info))
                    newEpisodeParams.data = oldData ?
                        [...oldData, ...newEpisodeParams.data] :
                        [...newEpisodeParams.data];
                state.info = newEpisodeParams.info;
            }
            console.log(newEpisodeParams);
            state.data = newEpisodeParams.data;
            state.requestInfo = newEpisodeParams.requestInfo;
        })
        builder.addCase(getEpisodes.pending, (state, action) => {
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
export const { } = episodesSlice.actions;
export default episodesSlice.reducer;
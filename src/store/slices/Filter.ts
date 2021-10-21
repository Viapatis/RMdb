import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EpisodeFilters, EndPoint } from '../../lib/apiCall';
export type sortValue = 'name' | 'relese';
interface Filter<T> {
    search: string,
    sort: sortValue,
    value?: T
}
interface FilterState {
    [index: string]: Filter<EpisodeFilters>,
    episode: Filter<EpisodeFilters>
}
const initialState = {
    episode: {
        search: '',
        sort: 'relese',
        value: {}
    } as Filter<EpisodeFilters>
} as FilterState;

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setSerachString(state, action: PayloadAction<{ name: EndPoint, value: string }>) {
            const { name, value } = action.payload;
            if (name in state)
                state[name].search = value;
        },
        setSortString(state, action: PayloadAction<{ name: EndPoint, value: sortValue }>) {
            const { name, value } = action.payload;
            if (name in state)
                state[name].sort = value;
        },
        setFilter(state, action: PayloadAction<{ name: EndPoint, value?: EpisodeFilters }>) {
            const { name, value } = action.payload;
            if (name in state)
                state[name].value = value;
        }
    }
})
export const { setSerachString, setFilter, setSortString } = filterSlice.actions;
export default filterSlice.reducer;
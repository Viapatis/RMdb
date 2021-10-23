import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EndPoint } from '../../lib/apiTypes';
export type sortValue = 'name' | 'relese';
interface Filter {
    search: string,
    sort: sortValue,
    btnValue: boolean
}
interface FilterState {
    [index: string]: Filter,
    episode: Filter
}
const initialState = {
    episode: {
        search: '',
        sort: 'relese',
        btnValue: true
    } as Filter
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
        setBtnValue(state, action: PayloadAction<{ name: EndPoint, value: boolean }>) {
            const { name, value } = action.payload;
            if (name in state)
                state[name].btnValue = !value;
        },
    }
})
export const { setSerachString, setBtnValue, setSortString } = filterSlice.actions;
export default filterSlice.reducer;
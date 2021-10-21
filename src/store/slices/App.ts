import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PROJECT_INFO from '../../projectDef';
export interface AppState {
    projectInfo: typeof PROJECT_INFO
}
const initialState = {
    projectInfo: PROJECT_INFO
} as AppState;

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {

    }
})
export const { } = appSlice.actions;
export default appSlice.reducer;
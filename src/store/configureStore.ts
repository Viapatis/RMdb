
import { configureStore } from '@reduxjs/toolkit'

import app from './slices/App';
import characters from './slices/characters';
import locations from './slices/Llocations';
import episodes from './slices/Episodes';

const store = configureStore({
  reducer: { app, episodes, characters, locations },
  devTools: process.env.NODE_ENV !== 'production'
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;
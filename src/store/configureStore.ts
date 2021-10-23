
import { configureStore } from '@reduxjs/toolkit'

import app from './slices/App';
import filter from './slices/Filter';
import main from './slices/Main';
const store = configureStore({
  reducer: { app, filter, main },
  devTools: process.env.NODE_ENV !== 'production'
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;
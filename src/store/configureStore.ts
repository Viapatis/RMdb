
import { configureStore } from '@reduxjs/toolkit'

import main from './slices/main'
import { MainState } from './slices/main'
const preloadedState = {
  main: {} as MainState
}
const store = configureStore({
  reducer: { main },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;
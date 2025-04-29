import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import dataReducer from '../features/data/dataSlice';
import filterReducer from '../features/filter/filterSlice';
import splitReducer from '../features/ui/splitSlice';
import selectionReducer from '../features/ui/selectionSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    data: dataReducer,
    filter: filterReducer,
    split: splitReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
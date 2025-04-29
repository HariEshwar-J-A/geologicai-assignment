import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  minMagnitude: number;
}

const initialState: FilterState = {
  minMagnitude: 0,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMinMagnitude(state, action: PayloadAction<number>) {
      state.minMagnitude = action.payload;
    },
  },
});

export const { setMinMagnitude } = filterSlice.actions;
export default filterSlice.reducer;

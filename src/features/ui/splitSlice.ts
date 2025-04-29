import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SplitState {
  widthPx: number; // left-pane width in pixels
}

const initialState: SplitState = {
  widthPx: 0, // uninitialized
};

export const splitSlice = createSlice({
  name: 'ui/split',
  initialState,
  reducers: {
    setSplitWidth(state, action: PayloadAction<number>) {
      state.widthPx = action.payload;
    },
  },
});

export const { setSplitWidth } = splitSlice.actions;
export default splitSlice.reducer
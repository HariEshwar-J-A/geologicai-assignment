import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectionState {
  selectedId: string | null;
}

const initialState: SelectionState = {
  selectedId: null,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
  },
});

export const { setSelectedId } = selectionSlice.actions;
export default selectionSlice.reducer;
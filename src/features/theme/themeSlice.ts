import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  darkMode: boolean;
}

const persisted = localStorage.getItem('darkMode');
const initialState: ThemeState = {
  darkMode: persisted ? JSON.parse(persisted) : false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    setDarkMode(state, action: { payload: boolean }) {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;

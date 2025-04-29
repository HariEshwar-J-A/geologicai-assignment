import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

// -- Create a fake theme slice for testing --
const themeSlice = createSlice({
  name: 'theme',
  initialState: { darkMode: false },
  reducers: {
    setDark: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});
const { setDark } = themeSlice.actions;

// -- ThemeProvider component --
import ThemeProvider from './ThemeProvider';

describe('ThemeProvider', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // ensure no leftover class
    document.documentElement.classList.remove('dark');

    store = configureStore({
      reducer: { theme: themeSlice.reducer },
    });
  });

  it('adds .dark class when darkMode=true', async () => {
    // start light
    render(
      <Provider store={store}>
        <ThemeProvider>
          <div />
        </ThemeProvider>
      </Provider>,
    );
    expect(document.documentElement).not.toHaveClass('dark');
    // now flip darkMode
    store.dispatch(setDark(true));
    // dispatch to turn dark on
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
    });
  });

  it('removes .dark class when darkMode=false', async () => {
    // start with darkMode=true
    store.dispatch(setDark(true));
    render(
      <Provider store={store}>
        <ThemeProvider>
          <div />
        </ThemeProvider>
      </Provider>,
    );
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // turn it off
    store.dispatch(setDark(false));
    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark');
    });
  });
});

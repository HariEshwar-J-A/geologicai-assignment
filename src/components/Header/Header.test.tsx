import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Header from './Header';
import themeReducer from '../../features/theme/themeSlice';

// Helper to render with a brand-new store
function renderWithStore(initialDark = false) {
  const store = configureStore({
    reducer: { theme: themeReducer },
    preloadedState: { theme: { darkMode: initialDark } },
  });
  render(
    <Provider store={store}>
      <Header />
    </Provider>,
  );
  return store;
}

describe('Header Component', () => {
  beforeEach(() => {
    // Make sure no lingering class
    document.documentElement.classList.remove('dark');
  });

  test('renders the correct title and button', () => {
    renderWithStore(false);
    expect(
      screen.getByRole('heading', { level: 1, name: /Geospatial Earthquake Explorer/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
  });

  test('initially shows Light label when darkMode=false', () => {
    renderWithStore(false);
    expect(screen.getByRole('button')).toHaveTextContent('☀️ Light');
    // no .dark class initially
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('first click dispatches toggleTheme and updates label to Dark', async () => {
    const user = userEvent.setup();
    const store = renderWithStore(false);

    const btn = screen.getByRole('button');
    await user.click(btn);

    // Redux flag flipped
    expect(store.getState().theme.darkMode).toBe(true);
    // Button label updated
    expect(btn).toHaveTextContent('🌙 Dark');
    // documentElement.class toggled with old value (false), so still no class
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('second click dispatches toggleTheme and toggles .dark class on <html>', async () => {
    const user = userEvent.setup();
    const store = renderWithStore(false);
    const btn = screen.getByRole('button');

    // 1st click: darkMode=true, no class
    await user.click(btn);
    expect(store.getState().theme.darkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // 2nd click: now dark===true, so toggles class on
    await user.click(btn);
    expect(store.getState().theme.darkMode).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    // label back to Light
    expect(btn).toHaveTextContent('☀️ Light');
  });

  test('multiple toggles invert class correctly', async () => {
    const user = userEvent.setup();
    renderWithStore(true); // start darkMode=true

    const btn = screen.getByRole('button');
    // initial state: darkMode=true, but .dark not set until toggle
    expect(btn).toHaveTextContent('🌙 Dark');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // click #1 (dark===true): adds class
    await user.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(btn).toHaveTextContent('☀️ Light');

    // click #2 (dark===false): removes class
    await user.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(btn).toHaveTextContent('🌙 Dark');
  });
});

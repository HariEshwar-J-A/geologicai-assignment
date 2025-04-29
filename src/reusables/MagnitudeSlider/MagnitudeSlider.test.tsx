import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../../features/filter/filterSlice';
import dataReducer from '../../features/data/dataSlice';
import themeReducer from '../../features/theme/themeSlice';
import MagnitudeSlider from './MagnitudeSlider';
import { vi } from 'vitest';
import { act } from '@testing-library/react';

describe('MagnitudeSlider Component', () => {
  function setup(status: 'idle' | 'loading' = 'idle') {
    const store = configureStore({
      reducer: { filter: filterReducer, data: dataReducer, theme: themeReducer },
      preloadedState: {
        filter: { minMagnitude: 2 },
        data: { items: [], status },
        theme: { darkMode: false },
      },
    });
    render(
      <Provider store={store}>
        <MagnitudeSlider />
      </Provider>,
    );
    return store;
  }

  test('shows initial slider value from store', () => {
    setup();
    const slider = screen.getByRole('slider', { name: /magnitude slider/i });
    expect(slider).toHaveValue('2');
    expect(screen.getByText('2.0')).toBeInTheDocument();
  });

  test('updates store on change after debounce', () => {
    vi.useFakeTimers();
    const store = setup();
    const slider = screen.getByRole('slider', { name: /magnitude slider/i });
    fireEvent.change(slider, { target: { value: '5.5' } });
    expect(screen.getByText('5.5')).toBeInTheDocument();
    // advance timers inside act to trigger debounce effect

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(store.getState().filter.minMagnitude).toBe(5.5);
    vi.useRealTimers();
  });

  test('is disabled when data is loading', () => {
    setup('loading');
    const slider = screen.getByRole('slider', { name: /magnitude slider/i });
    expect(slider).toBeDisabled();
  });
});

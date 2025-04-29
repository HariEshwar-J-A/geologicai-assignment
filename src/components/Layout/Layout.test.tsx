import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Layout from './Layout';
import dataReducer from '../../features/data/dataSlice';
import themeReducer from '../../features/theme/themeSlice';
import filterReducer from '../../features/filter/filterSlice';
import selectionReducer from '../../features/ui/selectionSlice';
import splitReducer from '../../features/ui/splitSlice';

// ---- Mock all the child components to simplify assertions ----
vi.mock('../Header/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock('../../reusables/MagnitudeSlider/MagnitudeSlider', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div data-testid="slider" className={className}>
      Slider
    </div>
  ),
}));
vi.mock('../../reusables/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Spinner</div>,
}));
vi.mock('../SplitPane/SplitPane', () => ({
  __esModule: true,
  default: ({
    pane1,
    pane2,
    initialPercent,
    minSizePx,
  }: {
    pane1: React.ReactNode;
    pane2: React.ReactNode;
    initialPercent: number;
    minSizePx: number;
  }) => (
    <div data-testid="splitpane">
      <div data-testid="pane1">{pane1}</div>
      <div data-testid="pane2">{pane2}</div>
      <div data-testid="initialPercent">{initialPercent}</div>
      <div data-testid="minSizePx">{minSizePx}</div>
    </div>
  ),
}));
vi.mock('../PlotPane/PlotPane', () => ({
  default: () => <div data-testid="plotpane">PlotPane</div>,
}));
vi.mock('../TablePane/TablePane', () => ({
  default: () => <div data-testid="tablepane">TablePane</div>,
}));

// ---- Helper to render Layout with a custom `data.status` ----
function renderWithStatus(status: 'idle' | 'loading' | 'failed') {
  const store = configureStore({
    reducer: {
      data: dataReducer,
      theme: themeReducer,
      filter: filterReducer,
      selection: selectionReducer,
      split: splitReducer,
    },
    preloadedState: {
      data: { items: [], status },
      theme: { darkMode: false },
      filter: { minMagnitude: 0 },
      selection: { selectedId: null },
      split: { widthPx: 0 },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <Layout />
      </Provider>,
    ),
  };
}

describe('Layout Component', () => {
  test('always renders Header and Slider', () => {
    renderWithStatus('idle');
    expect(screen.getByTestId('header')).toBeInTheDocument();
    const slider = screen.getByTestId('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveClass('mb-4'); // ensures your className passed through
  });

  test('when status is loading, shows Spinner and hides SplitPane', () => {
    renderWithStatus('loading');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('splitpane')).toBeNull();
  });

  test('when status is idle, shows SplitPane and hides Spinner', () => {
    renderWithStatus('idle');
    expect(screen.getByTestId('splitpane')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).toBeNull();

    // Verify that SplitPane got the correct props
    expect(screen.getByTestId('pane1')).toHaveTextContent('PlotPane');
    expect(screen.getByTestId('pane2')).toHaveTextContent('TablePane');
    expect(screen.getByTestId('initialPercent')).toHaveTextContent('50');
    expect(screen.getByTestId('minSizePx')).toHaveTextContent('270');
  });

  test('status "failed" also shows SplitPane (not spinner)', () => {
    renderWithStatus('failed');
    expect(screen.getByTestId('splitpane')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).toBeNull();
  });
});

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import PlotPane from './PlotPane';
import dataReducer, { Earthquake } from '../../features/data/dataSlice';
import filterReducer from '../../features/filter/filterSlice';
import selectionReducer from '../../features/ui/selectionSlice';

// --- Mocks for react-plotly.js ---
interface MockPlotProps {
  data: unknown;
  layout: unknown;
  onInitialized?: (_fig: unknown, div: HTMLDivElement) => void;
  onClick?: (event: { points?: Array<{ customdata: string }> }) => void;
  useResizeHandler?: boolean;
  style?: React.CSSProperties;
}

vi.mock('react-plotly.js/factory', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: (): React.FC<MockPlotProps> => {
      return function MockPlot(props: MockPlotProps) {
        React.useEffect(() => {
          props.onInitialized?.(null, document.createElement('div'));
        }, [props, props.onInitialized]);
        return (
          <div
            data-testid="mock-plot"
            onClick={() => props.onClick?.({ points: [{ customdata: 'a' }] })}
          />
        );
      };
    },
  };
});

// Spy on Plotly.Plots.resize
import Plotly from 'plotly.js-dist-min';
vi.spyOn(Plotly.Plots, 'resize');

vi.mock('../PlotlyLazy/helper', () => {
  // Pull in the same Plotly you’re using in prod
  const Plotly = import('plotly.js-dist-min');
  return {
    importPlotlyLib: () => Promise.resolve(Plotly),
  };
});

// Helper to create a full Earthquake object
function makeEQ(id: string, mag: number, latitude: number, longitude: number): Earthquake {
  return {
    id,
    time: Date.now().toString(),
    latitude,
    longitude,
    depth: 0,
    mag: mag,
    magType: '',
    nst: 0,
    gap: 0,
    dmin: 0,
    rms: 0,
    net: '',
    updated: Date.now().toString(),
    place: '',
    type: '',
    horizontalError: 0,
    depthError: 0,
    magError: 0,
    magNst: 0,
    status: '',
    locationSource: '',
    magSource: '',
  };
}

// Render helper with strongly-typed preloadedState
function renderWith({
  items,
  minMag = 0,
  selectedId = null,
}: {
  items: Earthquake[];
  minMag?: number;
  selectedId?: string | null;
}) {
  const store = configureStore({
    reducer: {
      data: dataReducer,
      filter: filterReducer,
      selection: selectionReducer,
    },
    preloadedState: {
      data: { items, status: 'idle' as const },
      filter: { minMagnitude: minMag },
      selection: { selectedId },
    },
  });
  render(
    <Provider store={store}>
      <PlotPane />
    </Provider>,
  );
  return store;
}

describe('PlotPane', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleItems = [makeEQ('a', 1, 10, 20), makeEQ('b', 5.5, 30, 40)];

  it('renders axis selectors with correct defaults', () => {
    renderWith({ items: sampleItems });
    const xSelect = screen.getByLabelText(/x-axis/i);
    const ySelect = screen.getByLabelText(/y-axis/i);
    expect(xSelect).toHaveValue('longitude');
    expect(ySelect).toHaveValue('mag');
    // all options present
    expect(within(xSelect).getByRole('option', { name: /Longitude/ })).toBeInTheDocument();
    expect(within(ySelect).getByRole('option', { name: /Magnitude/ })).toBeInTheDocument();
  });

  it('disables the selected option in the opposite dropdown', async () => {
    const user = userEvent.setup();
    renderWith({ items: sampleItems });
    const xSelect = screen.getByLabelText(/x-axis/i);
    const ySelect = screen.getByLabelText(/y-axis/i);

    // default: longitude disabled in Y
    expect(within(ySelect).getByRole('option', { name: /Longitude/, hidden: true })).toBeDisabled();

    // change X to latitude ⇒ latitude disabled in Y
    await user.selectOptions(xSelect, 'latitude');
    expect(xSelect).toHaveValue('latitude');
    expect(within(ySelect).getByRole('option', { name: /Latitude/, hidden: true })).toBeDisabled();
  });

  it('calls Plotly.Plots.resize on split:end', async () => {
    renderWith({ items: sampleItems });

    // grab the same PlotlyLib the component uses
    const { importPlotlyLib } = await import('../PlotlyLazy/helper');
    const PlotlyLib = await importPlotlyLib();

    // spy on its resize method
    const spy = vi.spyOn(PlotlyLib.Plots, 'resize');

    expect(spy).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('split:end'));

    // waitFor in case the effect hasn’t run synchronously
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('filters data by minMagnitude', () => {
    renderWith({ items: sampleItems, minMag: 3 });
    // both selectors still render even if only one point remains
    expect(screen.getByTestId('mock-plot')).toBeInTheDocument();
  });

  it('dispatches setSelectedId when plot is clicked', () => {
    const store = renderWith({ items: sampleItems });
    fireEvent.click(screen.getByTestId('mock-plot'));
    expect(store.getState().selection.selectedId).toBe('a');
  });

  it('prevents selecting the same value in both dropdowns by disabling the duplicate option', () => {
    renderWith({ items: sampleItems });
    const xSelect = screen.getByLabelText(/x-axis/i);
    const ySelect = screen.getByLabelText(/y-axis/i);

    // pick “Magnitude” on the Y axis
    userEvent.selectOptions(ySelect, 'mag');
    expect(ySelect).toHaveValue('mag');

    // now “Magnitude” must be disabled in the X axis dropdown
    expect(within(xSelect).getByRole('option', { name: /Magnitude/, hidden: true })).toBeDisabled();

    // likewise, switching X should disable that value in Y:
    userEvent.selectOptions(xSelect, 'longitude');
    expect(within(ySelect).getByRole('option', { name: /Longitude/, hidden: true })).toBeDisabled();
  });
});

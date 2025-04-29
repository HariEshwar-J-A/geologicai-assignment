import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setSelectedId } from '../../features/ui/selectionSlice';
import type { Earthquake } from '../../features/data/dataSlice';
import TablePane from './TablePane';
import { RootState } from '../../store';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

// Grab typed mocks
const mockedUseAppSelector = vi.mocked(useAppSelector);
const mockedUseAppDispatch = vi.mocked(useAppDispatch);

describe('TablePane', () => {
  let dispatchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatchMock = vi.fn();
    mockedUseAppSelector.mockReset();
    mockedUseAppDispatch.mockReturnValue(dispatchMock);
  });

  function stubSelectors(items: Earthquake[], minMag = 0, selectedId: string | null = null) {
    const fakeState: RootState = {
      theme: { darkMode: false },
      data: { items, status: 'idle' },
      filter: { minMagnitude: minMag },
      split: { widthPx: 300 },
      selection: { selectedId },
    };

    mockedUseAppSelector.mockImplementation((selector: (state: RootState) => unknown) =>
      selector(fakeState),
    );
  }

  // Helper to create fully-typed Earthquake objects
  function makeEQ(
    id: string,
    mag: number,
    time: string = '1620000000000',
    lat: number = 0,
    lon: number = 0,
  ): Earthquake {
    return {
      id,
      time,
      latitude: lat,
      longitude: lon,
      mag: mag,
      depth: 10,
      magType: 'Mw',
      nst: 0,
      gap: 0,
      dmin: 0,
      rms: 0,
      net: 'us',
      updated: `${Number(time) + 1000}`,
      place: `Place ${id}`,
      type: 'earthquake',
      horizontalError: 1,
      depthError: 1,
      magError: 0.1,
      magNst: 0,
      status: 'reviewed',
      locationSource: 'us',
      magSource: 'us',
    };
  }

  it('renders 15 rows on page 1 and correct buttons', () => {
    const items = Array.from({ length: 20 }, (_, i) => makeEQ(`${i}`, i));
    stubSelectors(items, 0, null);
    render(<TablePane />);
    // 15 data rows + 1 header row
    expect(screen.getAllByRole('row')).toHaveLength(16);
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeEnabled();
  });

  it('navigates to page 2 correctly', async () => {
    const items = Array.from({ length: 20 }, (_, i) => makeEQ(`${i}`, i));
    stubSelectors(items, 0, null);
    render(<TablePane />);

    await userEvent.click(screen.getByText('Next'));
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.getByText('Previous')).toBeEnabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('filters out below minMag', () => {
    const items = [makeEQ('a', 1), makeEQ('b', 5), makeEQ('c', 3)];
    stubSelectors(items, 4, null);
    render(<TablePane />);

    // only 'b' remains (1 header + 1 row)
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('b')).toBeInTheDocument();
  });

  it('dispatches selection on row click', () => {
    const items = [makeEQ('x', 2), makeEQ('y', 4)];
    stubSelectors(items, 0, null);
    render(<TablePane />);
    fireEvent.click(screen.getByText('y').closest('tr')!);
    expect(dispatchMock).toHaveBeenCalledWith(setSelectedId('y'));
  });

  it('jumps to selected row page', () => {
    const items = Array.from({ length: 21 }, (_, i) => makeEQ(`${i}`, i));
    stubSelectors(items, 0, '20');
    render(<TablePane />);

    const matches = screen.getAllByText('20');
    expect(matches.length).toBeGreaterThan(0);
    expect(screen.getByText('Next')).toBeEnabled();
    expect(screen.getByText('Previous')).toBeDisabled();
  });
});

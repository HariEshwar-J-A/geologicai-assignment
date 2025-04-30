import { describe, it, beforeEach, afterEach, expect, vi, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setSplitWidth } from '../../features/ui/splitSlice';
import SplitPane from './SplitPane';

vi.mock('../../hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

describe('SplitPane', () => {
  let dispatchMock: ReturnType<typeof vi.fn>;
  let getRectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatchMock = vi.fn();
    (useAppDispatch as Mock).mockReturnValue(dispatchMock);
    (useAppSelector as Mock).mockReturnValue(0);

    // mock getBoundingClientRect for the container
    getRectMock = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => new DOMRect(0, 0, 300, 0)) as Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes width based on initialPercent and minSizePx', () => {
    render(
      <SplitPane
        pane1={<div>Pane1</div>}
        pane2={<div>Pane2</div>}
        initialPercent={50}
        minSizePx={100}
      />,
    );
    const pane1 = screen.getByText('Pane1').parentElement!;
    // 50% of 300px = 150px
    expect(pane1).toHaveStyle('flex: 0 0 150px');
    expect(dispatchMock).toHaveBeenCalledWith(setSplitWidth(150));
  });

  it('clamps width to minSizePx when initialPercent too small', () => {
    // container width 200px, 10% => 20px < minSizePx=120
    getRectMock.mockReturnValueOnce({
      width: 200,
      left: 0,
      right: 200,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => '',
    });
    render(
      <SplitPane
        pane1={<div>Pane1</div>}
        pane2={<div>Pane2</div>}
        initialPercent={10}
        minSizePx={120}
      />,
    );
    const pane1 = screen.getByText('Pane1').parentElement!;
    expect(pane1).toHaveStyle('flex: 0 0 120px');
    expect(dispatchMock).toHaveBeenCalledWith(setSplitWidth(120));
  });

  it('updates width on drag and dispatches setSplitWidth', () => {
    render(
      <SplitPane
        pane1={<div>Pane1</div>}
        pane2={<div>Pane2</div>}
        initialPercent={50}
        minSizePx={50}
      />,
    );
    const pane1 = screen.getByText('Pane1').parentElement!;
    // locate gutter: next sibling of pane1
    const gutter = pane1.nextSibling as HTMLElement;

    fireEvent.mouseDown(gutter);
    // simulate dragging to x=200
    fireEvent.mouseMove(window, { clientX: 200 });
    expect(pane1).toHaveStyle('flex: 0 0 200px');
    expect(dispatchMock).toHaveBeenCalledWith(setSplitWidth(200));

    fireEvent.mouseUp(window);
  });

  it('emits split:end event on mouseUp', () => {
    const splitEndSpy = vi.fn();
    window.addEventListener('split:end', splitEndSpy);

    render(
      <SplitPane
        pane1={<div>Pane1</div>}
        pane2={<div>Pane2</div>}
        initialPercent={50}
        minSizePx={50}
      />,
    );
    const gutter = screen.getByText('Pane1').parentElement!.nextSibling as HTMLElement;
    fireEvent.mouseDown(gutter);
    fireEvent.mouseUp(window);
    expect(splitEndSpy).toHaveBeenCalled();

    window.removeEventListener('split:end', splitEndSpy);
  });
});

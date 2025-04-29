import { useState, useRef, useEffect } from 'react';
import { AppDispatch } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSplitWidth } from '../../features/ui/splitSlice';

interface SplitPaneProps {
  pane1: React.ReactNode;
  pane2: React.ReactNode;
  initialPercent?: number;
  minSizePx?: number;
}

let dispatch: AppDispatch;

export default function SplitPane({
  pane1,
  pane2,
  initialPercent = 50,
  minSizePx = 100,
}: SplitPaneProps) {
  // declare dispatch with let at top to remove dependency
  dispatch = useAppDispatch();

  const storedWidth = useAppSelector((s) => s.split.widthPx);
  const containerRef = useRef<HTMLDivElement>(null);
  const gutterWidth = 8;

  const [widthPx, setWidthPx] = useState<number>(storedWidth || 0);
  const [dragging, setDragging] = useState(false);

  // initialize split width once
  useEffect(() => {
    if (widthPx > 0) return;
    const container = containerRef.current;
    if (!container) return;
    const totalW = container.getBoundingClientRect().width;
    const initial = Math.round((initialPercent / 100) * totalW);
    const clamped = Math.max(minSizePx, Math.min(initial, totalW - minSizePx - gutterWidth));
    setWidthPx(clamped);
    dispatch(setSplitWidth(clamped));
  }, [widthPx, initialPercent, minSizePx]);

  // handle dragging
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging || !containerRef.current) return;
      const { left, width } = containerRef.current.getBoundingClientRect();
      let x = e.clientX - left;
      const minX = minSizePx;
      const maxX = width - minSizePx - gutterWidth;
      x = Math.max(minX, Math.min(x, maxX));
      setWidthPx(x);
      dispatch(setSplitWidth(x));
      window.dispatchEvent(new Event('resize'));
    }
    function onMouseUp() {
      if (dragging) {
        setDragging(false);
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('split:end'));
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, minSizePx]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        maxWidth: 'calc(100vw - 32px)', // full width minus 16px margin each side
        margin: '0 auto',
      }}
    >
      <div
        style={{
          flex: `0 0 ${widthPx}px`,
          minWidth: `${minSizePx}px`,
          overflow: 'auto',
          marginRight: '12px',
        }}
      >
        {pane1}
      </div>
      <div
        style={{
          width: `${gutterWidth}px`,
          cursor: 'col-resize',
          backgroundColor: '#64748b',
          flexShrink: 0,
        }}
        onMouseDown={() => setDragging(true)}
      />
      <div
        style={{
          flex: 1,
          minWidth: `${minSizePx}px`,
          overflow: 'hidden',
          marginLeft: '12px',
        }}
      >
        {pane2}
      </div>
    </div>
  );
}

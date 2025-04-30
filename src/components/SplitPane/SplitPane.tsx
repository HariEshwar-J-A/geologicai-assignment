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
  dispatch = useAppDispatch();
  const storedWidth = useAppSelector((s) => s.split.widthPx);
  const containerRef = useRef<HTMLDivElement>(null);
  const gutterWidth = 8;

  const [widthPx, setWidthPx] = useState<number>(storedWidth || 0);
  const [dragging, setDragging] = useState(false);

  // initialize width once
  useEffect(() => {
    if (widthPx > 0) return;
    const totalW = containerRef.current?.getBoundingClientRect().width ?? 0;
    const initial = Math.round((initialPercent / 100) * totalW);
    const clamped = Math.max(minSizePx, Math.min(initial, totalW - minSizePx - gutterWidth));
    setWidthPx(clamped);
    dispatch(setSplitWidth(clamped));
  }, [widthPx, initialPercent, minSizePx]);

  // handle pointer‐move & pointer‐up globally
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
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
    function onPointerUp() {
      if (!dragging) return;
      setDragging(false);
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('split:end'));
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragging, minSizePx]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        maxWidth: 'calc(100vw - 32px)',
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

      {/* gutter: start drag on any pointing device */}
      <div
        style={{
          width: `${gutterWidth}px`,
          cursor: 'col-resize',
          backgroundColor: '#64748b',
          flexShrink: 0,
        }}
        onPointerDown={(e) => {
          e.preventDefault(); // prevent accidental text‐selection
          setDragging(true);
        }}
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

import { useState, useMemo, useEffect, useRef } from 'react';
import Plotly, { PlotMouseEvent, Data as PlotData } from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setSelectedId } from '../../features/ui/selectionSlice';

const Plot = createPlotlyComponent(Plotly);
type AxisKey = 'mag' | 'latitude' | 'longitude';

export default function PlotPane() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.data.items);
  const minMag = useAppSelector((s) => s.filter.minMagnitude);
  const selectedId = useAppSelector((s) => s.selection.selectedId);

  const filtered = useMemo(() => items.filter((eq) => eq.mag >= minMag), [items, minMag]);

  const [xKey, setXKey] = useState<AxisKey>('longitude');
  const [yKey, setYKey] = useState<AxisKey>('mag');

  useEffect(() => {
    if (xKey === yKey) {
      setYKey(xKey === 'longitude' ? 'latitude' : 'mag');
    }
  }, [xKey, yKey]);

  useEffect(() => {
    if (yKey === xKey) {
      setXKey(yKey === 'longitude' ? 'latitude' : 'mag');
    }
  }, [xKey, yKey]);

  const options: AxisKey[] = ['longitude', 'latitude', 'mag'];
  const xData = useMemo(() => filtered.map((i) => i[xKey]), [filtered, xKey]);
  const yData = useMemo(() => filtered.map((i) => i[yKey]), [filtered, yKey]);
  const ids = useMemo(() => filtered.map((i) => i.id), [filtered]);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSplitEnd = () => {
      if (plotRef.current) Plotly.Plots.resize(plotRef.current);
    };
    window.addEventListener('split:end', handleSplitEnd);
    return () => window.removeEventListener('split:end', handleSplitEnd);
  }, []);

  const trace: PlotData = {
    x: xData,
    y: yData,
    customdata: ids,
    type: 'scattergl',
    mode: 'markers',
    marker: {
      size: ids.map((id) => (id === selectedId ? 12 : 6)),
      color: ids.map((id) => (id === selectedId ? 'red' : 'blue')),
      opacity: 0.8,
    },
  };

  const layout = {
    autosize: true,
    margin: { l: 40, r: 20, t: 20, b: 40 },
    xaxis: {
      gridcolor: '#888',
      zerolinecolor: '#444',
      title: xKey === 'mag' ? 'Magnitude' : xKey.charAt(0).toUpperCase() + xKey.slice(1),
    },
    yaxis: {
      gridcolor: '#888',
      zerolinecolor: '#444',
      title: yKey === 'mag' ? 'Magnitude' : yKey.charAt(0).toUpperCase() + yKey.slice(1),
    },
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--panel-bg)]">
      <div className="flex space-x-4 p-3 bg-white dark:bg-gray-800 sticky top-0 z-10">
        {['X-Axis', 'Y-Axis'].map((label, idx) => {
          const key = idx === 0 ? xKey : yKey;
          const setKey = idx === 0 ? setXKey : setYKey;
          return (
            <div className="flex-1" key={label}>
              <label className="block text-sm font-medium">{label}</label>
              <select
                aria-label={label.toLowerCase()}
                value={key}
                onChange={(e) => setKey(e.target.value as AxisKey)}
                className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-gray-100"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt} disabled={idx === 1 && opt === xKey}>
                    {opt === 'mag' ? 'Magnitude' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      <div className="flex-1 overflow-hidden">
        <Plot
          data={[trace]}
          layout={layout}
          onInitialized={(_fig, div) => (plotRef.current = div as HTMLDivElement)}
          onClick={(e: PlotMouseEvent) => {
            const pt = e.points?.[0];
            if (pt?.customdata) dispatch(setSelectedId(pt.customdata as string));
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

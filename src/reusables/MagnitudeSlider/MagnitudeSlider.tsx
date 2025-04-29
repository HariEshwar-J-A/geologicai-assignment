import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setMinMagnitude } from '../../features/filter/filterSlice';

interface MagnitudeSliderProps {
  className?: string;
}

export default function MagnitudeSlider({ className = '' }: MagnitudeSliderProps) {
  const dispatch = useAppDispatch();
  const reduxMin = useAppSelector((s) => s.filter.minMagnitude);
  const status = useAppSelector((s) => s.data.status);

  const [localMin, setLocalMin] = useState(reduxMin);
  const debouncedMin = useDebounce(localMin, 200);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(setMinMagnitude(debouncedMin));
    }
  }, [debouncedMin, dispatch, status]);

  return (
    <div className={`p-4 flex items-center space-x-4 ${className}`}>
      <label htmlFor="mag-slider" className="font-medium">
        Min Magnitude: <span className="font-bold">{localMin.toFixed(1)}</span>
      </label>
      <input
        id="mag-slider"
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={localMin}
        onChange={(e) => setLocalMin(parseFloat(e.target.value))}
        disabled={status !== 'idle'}
        aria-label="Magnitude Slider"
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

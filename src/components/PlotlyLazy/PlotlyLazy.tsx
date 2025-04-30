import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import { importPlotlyLib } from './helper';

// The actual React.lazy component that PlotPane will render
const Plot = React.lazy(async () => {
  const Plotly = await importPlotlyLib();
  const PlotComponent = createPlotlyComponent(Plotly);
  return { default: PlotComponent };
});

export default Plot;

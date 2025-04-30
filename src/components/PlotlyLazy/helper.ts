export async function importPlotlyLib() {
  /* 
  We can use the below import instead for a basic version of the plotly 
  - because 'plotly.js-basic-dist-min' has less chunk size compared to 'plotly.js-dist-min' 
  - (1,142.07 kB │ gzip: 388.65 kB <<< 4,620.64 kB │ gzip: 1,399.88 kB)
  - but to provide best performance, the basic version is not enough. 
  */

  // const Plotly = (await import('plotly.js-basic-dist-min')).default;


  // This import will end up in the same chunk as the React.lazy below
  const Plotly = (await import('plotly.js-dist-min')).default;
  return Plotly;
}
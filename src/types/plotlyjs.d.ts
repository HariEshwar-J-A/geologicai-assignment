// tell TS that imports from 'plotly.js-dist-min' actually have all of plotly.js
declare module 'plotly.js-dist-min' {
    import PlotlyNamespace from 'plotly.js';
    export = PlotlyNamespace;
  }
  
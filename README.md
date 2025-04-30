# Geospatial Earthquake Explorer

A React + TypeScript application for exploring worldwide earthquake data visually and in tabular form. Powered by USGS CSV feeds, Plotly.js maps, and a responsive, themeable UI. Submitted by Harieshwar Jagan Abirami towards GeologicAI Technical Assessment.

---

## Table of Contents

1. [Features](#features)  
2. [Demo](#demo)  
3. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Development](#development)  
   - [Production Build](#production-build)  
   - [Testing](#testing)  
4. [External Libraries](#external-libraries)  
5. [Extra Functionality](#extra-functionality)  
6. [Project Structure](#project-structure)  
7. [License](#license)  
8. [AI Documentation](./docs/AI_USAGE.md)
9. [Test Documentation](./docs/TESTS.md)

---

## Features

- **Live Earthquake Feed**  
  Fetches and parses the latest **all_month.csv** from USGS.

- **Interactive Scatter Plot**  
  Powered by Plotly.js:
  - Choose any two axes (longitude, latitude, magnitude).
  - Prevent duplicate axis selection.
  - Click a point to highlight the corresponding table row.

- **Responsive Split-Pane Layout**  
  - Draggable divider: resize panes by pixel.
  - Auto-resize Plotly on drag handles.
  - Below 640 px width → vertical stacking.

- **Filter & Pagination Table**  
  - Slide to filter by minimum magnitude.
  - 15 rows per page, auto-jump to selected row.
  - Sticky headers, zebra striping, hover & selected styles.

- **Dark / Light Theme Toggle**  
  - CSS custom properties + Tailwind “dark” class.
  - Material-inspired color palette.

- **Full Test Coverage**  
  - Vitest + React Testing Library.
  - Covers components, hooks, splitting, plot behaviors, theming.

---

## Demo

A live demo is available at:  
> [https://your-gh-pages-site.example.com](https://your-gh-pages-site.example.com)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.9 (includes npm or yarn)  
- **Git**  

### Installation

```bash
git clone https://github.com/HariEshwar-J-A/geologicai-assignment.git
cd geologicai-assignment

# install dependencies (already has package-lock.json) - recommended
npm install
# or (create new yarn-lock.json)
yarn install
```
### Development

```bash

npm run dev
# or
yarn dev
```

**Open your browser at http://localhost:5173**

### Production Build

```bash
# Create a production build
npm run build
# and Preview the production build
npm run preview
```

### Testing

```bash
# Run unit tests with Vitest
npm run test
```

### External Libraries

- **Vite** — Fast build tooling and dev server.

- **React & TypeScript** — UI framework with type safety.

- **Redux Toolkit** — State management for data, filters, selection, split pane, and theme.

- **TanStack Table** — Headless table for sorting, pagination, and sticky headers.

- **Plotly.js & react‑plotly.js** — High‑performance interactive charts.

- **Tailwind CSS** — Utility‑first styling with dark mode support.

- **PapaParse** — CSV parsing library for data ingestion.

- **Vitest & Testing Library** — Unit & integration testing.

- **PostCSS (@tailwindcss/postcss)** — Tailwind integration for Vite.

### Extra Functionality

- Movable handle between 2 panes for improved UX.

- Default data sorting is by magnitude descending; user‑configurable sorting will be added later.

- Theme colors and CSS variables are defined in tailwind.config.js and a global CSS file.

- The app automatically resizes the Plotly chart on window or split‑pane size changes.

### Project Structure

```bash
.
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── components
│   │   ├── Header
│   │   │   ├── Header.test.tsx
│   │   │   └── Header.tsx
│   │   ├── Layout
│   │   │   ├── Layout.test.tsx
│   │   │   └── Layout.tsx
│   │   ├── SplitPane
│   │   │   ├── SplitPane.test.tsx
│   │   │   └── SplitPane.tsx
│   │   ├── PlotPane
│   │   │   ├── PlotPane.test.tsx
│   │   │   └── PlotPane.tsx
│   │   ├── TablePane
│   │   │   ├── TablePane.test.tsx
│   │   │   └── TablePane.tsx
│   │   └── ThemeProvider
│   │       ├── ThemeProvider.test.tsx
│   │       └── ThemeProvider.tsx
│   ├── reusables
│   │   ├── MagnitudeSlider
│   │   │   ├── MagnitudeSlider.test.tsx
│   │   │   └── MagnitudeSlider.tsx
│   │   └── Spinner
│   │       ├── Spinner.test.tsx
│   │       └── Spinner.tsx
│   ├── hooks
│   │   └── index.ts
│   ├── features
│   │   ├── data
│   │   │   └── dataSlice.ts
│   │   ├── filter
│   │   │   └── filterSlice.ts
│   │   ├── theme
│   │   │   └── themeSlice.ts
│   │   └── ui
│   │       ├── splitSlice.ts
│   │       └── selectionSlice.ts
│   └── store
│       └── index.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── LICENSE
```

### License

**MIT License**

Copyright (c) 2025 Harieshwar Jagan Abirami

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      
copies of the Software, and to permit persons to whom the Software is          
furnished to do so, subject to the following conditions:                       

The above copyright notice and this permission notice shall be included in     
all copies or substantial portions of the Software.                            

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR     
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,       
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE    
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER         
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN      
THE SOFTWARE.

##### Enjoy exploring earthquake patterns around the globe!
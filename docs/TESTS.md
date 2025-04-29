# Frontend Test Suite Documentation

This document summarizes all the Jest/Vitest-powered test files in the codebase, explaining their purpose, structure, and the key behaviors they verify.

---

## 1. `Header.test.tsx`

**Location:** `src/components/Header/Header.test.tsx`

### Purpose

Tests the theme‐toggle header component:
- Renders the correct title.
- Renders a toggle button with the appropriate label.
- Dispatches the Redux `toggleTheme` action.
- Applies/removes the `.dark` class on `<html>` correctly over multiple clicks.

### Key Tests

| Test Name                                                                          | What It Checks                                                                                              |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **renders the correct title and button**                                           | The header shows “Geospatial Earthquake Explorer” and a toggle button.                                       |
| **initially shows Light label when darkMode=false**                                | Button text is “☀️ Light” and `<html>` has no `.dark` class.                                                |
| **first click dispatches toggleTheme and updates label to Dark**                   | Clicking toggles the Redux flag, updates the button to “🌙 Dark”, but does not yet add `.dark`.             |
| **second click dispatches toggleTheme and toggles `.dark` class on `<html>`**      | The second click flips the flag back, and now adds the `.dark` class; label resets to “☀️ Light”.           |
| **multiple toggles invert class correctly**                                        | Verifies any further toggles properly add/remove `.dark` and update the label in alternation.               |

---

## 2. `Layout.test.tsx`

**Location:** `src/components/Layout/Layout.test.tsx`

### Purpose

Tests the top‐level layout container that orchestrates header, slider, loading spinner, and split pane.

### Mocks

All child components (`Header`, `MagnitudeSlider`, `Spinner`, `SplitPane`, `PlotPane`, `TablePane`) are mocked to simplify assertions.

### Key Tests

| Test Name                                         | What It Checks                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **always renders Header and Slider**               | Header and slider placeholders always appear; slider receives the `className="mb-4"` prop.             |
| **when status is loading, shows Spinner**          | With `data.status === 'loading'`, only the spinner is shown; split pane is hidden.                     |
| **when status is idle, shows SplitPane**           | With `data.status === 'idle'`, the split pane appears (spinner is hidden), and its `pane1`/`pane2` props are correct. |
| **status "failed" also shows SplitPane**           | Even on `data.status === 'failed'`, layout falls back to showing the split pane, not the spinner.      |

---

## 3. `PlotPane.test.tsx`

**Location:** `src/components/PlotPane/PlotPane.test.tsx`

### Purpose

Validates the interactive Plotly scatter‐plot pane, axis selectors, resize behavior, and selection integration.

### Mocks & Setup

- **`react-plotly.js/factory`** is mocked to a simple `<div data-testid="mock-plot" />` that invokes `onInitialized` on mount and `onClick` with a fake point.
- **`Plotly.Plots.resize`** is spied on to verify split‐pane resizing.

### Key Tests

| Test Name                                                | What It Checks                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **renders axis selectors with correct defaults**         | Both X and Y dropdowns render, defaulting to `longitude`/`mag`; all three options appear.          |
| **disables the selected option in the opposite dropdown**| Selecting one axis disables that option in the other dropdown to avoid duplicates.                  |
| **calls Plotly.Plots.resize on split:end**               | Dispatching a `split:end` event triggers `Plotly.Plots.resize`.                                      |
| **filters data by minMagnitude**                         | Passing a higher `minMag` still renders the plot container (even if only one point remains).        |
| **dispatches setSelectedId when plot is clicked**        | Clicking the mock plot invokes the Redux `setSelectedId` with the point’s `customdata`.             |
| **auto-adjusts duplicate axes correctly**                | Changing one selector to match the other triggers the effect that automatically re‐selects the other axis to a different field. |

---

## 4. `SplitPane.test.tsx`

**Location:** `src/components/SplitPane/SplitPane.test.tsx`

### Purpose

Verifies the draggable splitter between two panes:
- Initial width calculation based on container size, `initialPercent`, and `minSizePx`.
- Clamping at `minSizePx`.
- Live dragging updates both the pane width and Redux store.
- Emitting the custom `split:end` event on drag end.

### Key Tests

| Test Name                                              | What It Checks                                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **initializes width based on initialPercent/minSizePx**| On mount, left‐pane width = `initialPercent%` of container (clamped to `minSizePx`).                |
| **clamps width to minSizePx when initialPercent too small** | Ensures the width does not go below `minSizePx`, even if the percentage calculation is smaller.      |
| **updates width on drag and dispatches setSplitWidth** | Simulating `mousemove` after `mousedown` changes width style and dispatches the action.             |
| **emits split:end event on mouseUp**                   | On drag end, ensures a `split:end` event is fired on the window.                                    |

---

## 5. `TablePane.test.tsx`

**Location:** `src/components/TablePane/TablePane.test.tsx`

### Purpose

Tests the paginated, filterable earthquake data table:
- Filters by minimum magnitude.
- Paginates correctly with a page size of 15.
- Dispatches selection on row click.
- Jumps to the page containing the selected row.

### Mocking

Replaces `useAppSelector`/`useAppDispatch` to drive selectors from a fake `RootState`. A helper `stubSelectors()` builds a complete `RootState` object so `items`, `minMagnitude`, and `selectedId` all come from one consistent state.

### Key Tests

| Test Name                                    | What It Checks                                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **renders 15 rows on page 1 and correct buttons**  | First page shows 15 data rows + header, “Previous” disabled, “Next” enabled.                         |
| **navigates to page 2 correctly**                 | Clicking “Next” moves to page 2 (remaining rows + header), buttons enable/disable appropriately.    |
| **filters out below minMag**                      | Only rows with `mag >= minMagnitude` appear (header + filtered rows).                                 |
| **dispatches selection on row click**             | Clicking a row dispatches `setSelectedId` with that row’s `id`.                                       |
| **jumps to selected row page**                    | When `selectedId` is provided, table jumps to the correct page so that row is visible, and buttons update. |

---

## 6. `ThemeProvider.test.tsx`

**Location:** `src/components/ThemeProvider/ThemeProvider.test.tsx`

### Purpose

Ensures the `<ThemeProvider>` effect hooks into Redux state and toggles the `<html>.dark` class whenever `darkMode` changes.

### Key Tests

| Test Name                                | What It Checks                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **adds .dark class when darkMode=true**  | Dispatching `setDark(true)` causes the provider’s effect to add the `.dark` class on `<html>`.            |
| **removes .dark class when darkMode=false** | Dispatching `setDark(false)` causes the `.dark` class to be removed.                                       |

---

## 7. `MagnitudeSlider.test.tsx`

**Location:** `src/reusables/MagnitudeSlider/MagnitudeSlider.test.tsx`

### Purpose

Verifies the reusable slider component:
- Initializes its value from the Redux store’s `minMagnitude`.
- Debounces updates before dispatching to Redux.
- Disables itself when the data slice is in a loading state.

### Key Tests

| Test Name                             | What It Checks                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **shows initial slider value from store**  | Slider starts at `filter.minMagnitude` and the label next to it matches.                                         |
| **updates store on change after debounce** | Changing the slider value updates the label immediately, then—after 200 ms—dispatches the updated filter value. |
| **is disabled when data is loading**      | When `data.status==='loading'`, the slider’s `<input>` is disabled.                                             |

---

## 8. `Spinner.test.tsx`

**Location:** `src/reusables/Spinner/Spinner.test.tsx`

### Purpose

Basic smoke test for the loading spinner:
- Renders an element with `role="status"` and `aria-label="Loading…"`.

---

### How to Read This Documentation

1. **File Location**  
   Each section tells you where the test file lives in the repository.

2. **Purpose**  
   A short description of what component behavior the tests cover.

3. **Mocks & Setup** (where applicable)  
   Explains how external dependencies (Redux, Plotly, child components) are mocked.

4. **Key Tests**  
   A table describing each individual test, its name, and the specific behavior it asserts.

---

By following this guide, you can quickly understand what each test file covers, and ensure new tests adhere to the same conventions and coverage standards.

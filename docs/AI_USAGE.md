# AI Prompt Usage Documentation

This document catalogues the key AI prompts used during development of the **Geospatial Earthquake Explorer** frontend, describes their intent, and evaluates their impact in reducing deliverable time. It also highlights where human intervention was still necessary, and lessons learned.

---

## 1. Tailwind + Vite Configuration

**Prompt**  
> *“How do I configure Tailwind CSS with Vite for a React + TypeScript project? I need postcss setup, content paths, dark mode, and basic plugin installation.”*

- **Goal:** Get a minimal, correct `tailwind.config.js` and PostCSS setup for Vite.  
- **AI Output:**  
  - Advised installing `@tailwindcss/postcss` instead of using `tailwindcss` directly.  
  - Provided sample `postcss.config.js`.  
  - Suggested:  
    ```js
    // tailwind.config.js
    module.exports = {
      content: ['./index.html','src/**/*.{ts,tsx}'],
      darkMode: 'class',
      plugins: [require('@tailwindcss/forms')],
    }
    ```  
- **Impact:**  
  - **Time saved:** ~1 hour of trial-and-error.  
  - **Human work:** Verified paths and plugin versions; adjusted for monorepo layout.  
- **Lessons:**  
  - AI surfaced the new PostCSS plugin requirement immediately.  
  - Minor typo in globs required manual fix.

---

## 2. Split-Pane & Responsive Layout

**Prompt**  
> *“Implement a draggable split pane in React/TypeScript without external libraries. It must switch to vertical stacking below 640 px and respect minimum pane widths.”*

- **Goal:** Build `SplitPane.tsx` with width-based split and breakpoint logic.  
- **AI Output:**  
  - `useEffect` hooks for initialization & drag events.  
  - `window.dispatchEvent('split:end')` for cross-component resizing.  
  - CSS media-query for mobile stacking under 640 px.  
- **Impact:**  
  - **Time saved:** ~2 hours writing boilerplate.  
  - **Human work:** Tweaked breakpoints, margins; fixed style regressions.  
- **Lessons:**  
  - Event-based architecture fit perfectly.  
  - Initial CSS missed Vite’s margin paddings—manual tweaks needed.

---

## 3. Testing with Vitest + React Testing Library

**Prompt**  
> *“Generate a Vitest test file for a React component `TablePane` that…  
> 1) mocks Redux selectors;  
> 2) verifies pagination, filtering, selection;  
> 3) covers edge cases like out-of-range pages and `minMagnitude` filtering.”*

- **Goal:** Comprehensive, TDD-style tests for `TablePane.tsx`.  
- **AI Output:**  
  - Full `TablePane.test.tsx` scaffold with `vi.mock('../../hooks')`.  
  - Helper `makeEQ()` to create typed `Earthquake` objects.  
  - Test cases for:  
    - Initial render row count  
    - “Next”/“Previous” button states  
    - Filtering logic  
    - Selection dispatch  
    - Page-jump on selection  
- **Impact:**  
  - **Time saved:** ~3 hours thinking through edge cases and writing boilerplate.  
  - **Human work:** Refined mock implementations against our `RootState`.  
- **Lessons:**  
  - AI enumerated edge cases we might have missed.  
  - Several iterations were needed to align mocks with our selector patterns.

---

## 4. PlotPane Interactivity & Plotly Integration

**Prompt**  
> *“In React + Plotly, implement two `<select>` controls for X/Y axes.  
> Prevent selecting the same metric in both dropdowns by disabling the duplicate option, auto-rotate to a fallback axis, and ensure split-pane resizing triggers a Plotly resize.”*

- **Goal:** Make chart axes fully interactive, two-way bound to Redux.  
- **AI Output:**  
  - `onClick` handler dispatching `setSelectedId`.  
  - Two `useEffect` hooks preventing duplicate selections.  
  - `window.addEventListener('split:end')` resize logic.  
- **Impact:**  
  - **Time saved:** ~2 hours wiring up Plotly’s React integration.  
  - **Human work:** Fixed invalid prop (`transformData`) and tightened types for `PlotMouseEvent`.  
- **Lessons:**  
  - AI’s pattern matched Plotly’s documented React factory approach.  
  - Auto-rotate logic needed manual, test-driven refinement.

---

## 5. Documentation & README Generation

**Prompt**  
> *“Generate a `README.md` for this React+Tailwind+Plotly project:  
> include setup (Vite, Tailwind, PostCSS), run commands, folder structure, feature list, testing instructions.”*

- **Goal:** A thorough README guiding future contributors.  
- **AI Output:**  
  - Sections: **Installation**, **Development**, **Testing**, **Directory Layout**, **Features**, **License**.  
  - Code blocks for `npm install`, `npm run dev`, `npm test`.  
- **Impact:**  
  - **Time saved:** ~1.5 hours writing structured docs.  
  - **Human work:** Updated monorepo scripts; added screenshots manually.  
- **Lessons:**  
  - AI provided complete skeleton.  
  - Default badges needed manual editing to match our CI.

---

## Lessons & Best Practices

1. **Keep prompts focused.**  
   - Smaller, targeted queries yield higher-quality responses.

2. **Verify AI output.**  
   - Always cross-check versions, imports, and project-specific details.

3. **Use AI for boilerplate & brainstorming.**  
   - Let AI draft edge-case matrices, component skeletons, and tests.

4. **Iterate with feedback.**  
   - Feed test failures back into prompts to converge rapidly on correct behavior.

5. **Human oversight is irreplaceable.**  
   - Domain logic, accessibility, and precise typing require manual review.

---

**Overall Impact:**  
By strategically leveraging AI for setup, boilerplate, and testing scaffolds, we cut an estimated **60–70%** of development time on non-domain tasks, letting myself concentrate on UX, interactivity, and domain-specific features.

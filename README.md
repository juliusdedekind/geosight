<img width="3811" height="1901" alt="image" src="https://github.com/user-attachments/assets/89125dc3-bb4d-45fd-9c3f-ed34e2b3dd14" />

# GeoSight: Earth Curvature and Horizon Simulator

GeoSight is a local web application for exploring earth curvature, horizon distance, target visibility, hidden height, apparent drop, and atmospheric refraction. The goal is to make the geometry inspectable: numbers, controls, and visualization should update together so a user can compare globe, flat-earth, and combined views without relying on a black-box calculator.

This project is inspired by and developed as a local reimplementation study of Walter Bislin's excellent [Advanced Earth Curvature Calculator](https://walter.bislins.ch/bloge/index.asp?page=Advanced+Earth+Curvature+Calculator). Bislin's work provides the reference feature set and much of the conceptual target for this project, especially the emphasis on exact equations, refraction-aware horizon data, configurable units, and side-by-side model comparison.

## Project Goals

- Recreate the major workflows of the Advanced Earth Curvature Calculator in a local, modern web stack.
- Keep the calculation model separate from the UI so formulas can be tested and refined independently.
- Support globe, flat-earth, overlay, and side-by-side visualization modes.
- Model observer height, target distance, target size, target lift, refraction, atmospheric assumptions, and unit conversions.
- Show both visual output and derived data, including visible/hidden target height, angular size, drop, dip angle, surface distance, sagitta, grid spacing, and refraction-related values.
- Preserve local state through export/import workflows so scenarios can be saved and restored.
- Use the included `jsgx3d` folder as a reference for understanding Bislin-style projection and visualization behavior while keeping the application implementation in TypeScript.

## Web Stack

GeoSight is built as a client-side TypeScript application.

- **Vite** provides the development server, fast module loading, and production bundling.
- **React** owns the UI composition for controls, data panels, and the app shell.
- **TypeScript** keeps the geometry, units, state, and rendering contracts explicit.
- **Zustand** provides a lightweight shared state store for calculator inputs, derived settings, and state import/export.
- **Canvas 2D** renders the curvature scene. The renderer uses a small projection adapter in `src/visualization/jsgProjection.ts` to move toward the perspective behavior of Bislin's original visualization.
- **Vitest** covers the core calculation model with focused unit tests.

## Architecture

The codebase is organized around separation between model, state, UI, and rendering.

```text
src/
  core/
    atmosphere.ts          Standard-atmosphere and refraction helpers
    curvatureModel.ts      Main geometric model and derived values
    curvatureModel.test.ts Focused tests for core calculator behavior
    math.ts                Shared math helpers
    units.ts               Unit conversion and formatting
  state/
    curveStore.ts          Zustand store, defaults, setters, export/import
  ui/
    App.tsx                Top-level shell
    InputPanels.tsx        Controls and sliders
    DataPanels.tsx         Numeric output panels
  visualization/
    CurvatureScene.tsx     Canvas renderer
    jsgProjection.ts       Projection helper inspired by JSG-style behavior
  main.tsx                 React entry point
  styles.css               App layout and visual styling
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev -- --port 5173
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Current Status

GeoSight is very much a work in progress. The main calculation pipeline, controls, unit conversion, state export/import, and a first-pass Bislin-style visualization are in place, but runtime behavior and UI polish still need focused work. The next important work is improving parity with the reference calculator, especially projection behavior, view-mode toggles, slider ergonomics, data-panel coverage, and general interaction stability.

## License

GeoSight is licensed under the GNU Affero General Public License v3.0 or later (`AGPL-3.0-or-later`). See `LICENSE` for the full license text and `NOTICE` for attribution and third-party notices.

## Acknowledgement

Walter Bislin's [Advanced Earth Curvature Calculator](https://walter.bislins.ch/bloge/index.asp?page=Advanced+Earth+Curvature+Calculator) is the benchmark and inspiration for this effort. This repository is not a replacement for that original work; it is a local study and reimplementation intended to understand, preserve, and extend the calculator experience in a modern TypeScript application.

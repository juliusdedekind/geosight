# Bislin Example 1 Evaluation

## Reference Case

The artifacts in `examples/1` represent one Bislin calculator run from:

<https://walter.bislins.ch/bloge/index.asp?page=Advanced+Earth+Curvature+Calculator>

Inputs captured in `userinputparams.png`:

- Observer height: 2 m
- Target distance: 12,000 m
- Target size: 10 m
- Refraction coefficient: 0
- Zoom/focal length: 3,000 mm
- Diagonal field of view: 0.826317 deg
- Model: Globe
- Camera aim: Horizon
- Show data: Object, Refraction, Horizon enabled; Left-right drop disabled
- Units: metric
- Angle format: decimal degrees

Key captured outputs in `outputdata.png` and `projection.png`:

- Visible: 6.20719 m
- Hidden: 3.79281 m
- Drop: 11.3012 m
- Drop angle: 0.0539593 deg
- Angular size: 0.0477464 deg
- Target top angle: -0.0157622 deg
- Tilt: 0.107919 deg
- Horizon dip angle: 0.0453993 deg
- Horizon distance on surface: 5,048.17 m
- Drop from surface: 2 m
- Drop from eye level: 4 m
- Sagitta/bulge: 2.8253 m
- Grid spacing: 217.178 m
- Apparent radius: 6,371,000 m

## Current Status

GeoSight's core math already matches the Bislin formula family for this case. The existing math test suite includes the same 12 km target, 2 m observer, 10 m target, zero-refraction scenario, and the full test suite passes.

The largest remaining gaps are not basic curvature math. They are parity fixtures, display precision, source-calculator control coverage, and projection rendering fidelity.

Update, 2026-05-03: the source `ControlPanel` runtime has been vendored under `public/vendor/control-panel` and is now used by the React app through `src/ui/ControlPanelControls.tsx`. The old recommendation to expose camera aim, diagonal FOV, and show-data controls is partially addressed at the UI layer. Remaining work is to tighten parity details, especially field-specific display formatting and any source controls not yet represented in the CP adapter.

## Recommended Changes

### 1. Add Example 1 as a Golden Regression Fixture

Create a test that asserts the exact captured values above against `computeCurve(defaultInputs)` or an explicit `example1Inputs` fixture. This will make the screenshots in `examples/1` actionable rather than only documentary.

Suggested assertions:

- `objectVisible ~= 6.20719`
- `objectHidden ~= 3.79281`
- `objectDropFromObserverSurface ~= 11.3012`
- `objectDropAngleDeg ~= 0.0539593`
- `objectSizeAngleDeg ~= 0.0477464`
- `objectTopAngleDeg ~= -0.0157622`
- `objectNearTiltDeg ~= 0.107919`
- `horizonDropAngleDeg ~= 0.0453993`
- `horizonSurfaceDistance ~= 5048.17`
- `horizonDropFromObserverSurface ~= 2`
- `horizonDropFromEyeLevel ~= 4`
- `bulge ~= 2.8253`
- `gridSpacing ~= 217.178`

### 2. Add Missing Source-Calculator Controls

The Bislin input panel exposes controls that GeoSight either stores internally or approximates through other controls:

- Diagonal field of view
- Camera aim: Horizon / Eye-level
- Show data toggles for object, refraction, horizon, and left-right drop

GeoSight should expose these directly so an example can be recreated without editing exported state JSON.

Status: mostly implemented via the CP-backed control adapter. Keep this item open only for auditing parity against the full source calculator control list.

### 3. Tighten Output Formatting Parity

The source calculator uses field-specific precision. GeoSight currently applies generic number formatting, which is easier to maintain but harder to compare against screenshots.

Recommended approach:

- Keep generic formatting for normal app use.
- Add field-specific formatting for Bislin parity mode or data panels.
- Use fixed decimal places for screenshot-comparable values where appropriate.

### 4. Use the Reported Grid Spacing in the Projection

The app reports the correct grid spacing, but the visual grid renderer currently coarsens the spacing for display. Example 1 reports about 217.178 m; the rendered grid should have a fidelity mode that honors that spacing when matching Bislin output.

Recommended approach:

- Add a measurement/parity rendering mode that uses `outputs.gridSpacing` directly.
- Keep adaptive coarsening only for performance-oriented interactive rendering.

### 5. Separate Visual Aid Scaling from Measurement-Faithful Rendering

The target rod is intentionally clamped and scaled to remain visible. That helps usability but makes screenshot parity difficult, especially with narrow fields of view.

Recommended approach:

- Add a measurement-faithful target rendering mode.
- Keep the current enhanced visibility mode as the default if it feels better interactively.
- Label or encode the rendering mode in exported state.

### 6. Share Hidden-Height Logic Between Core and Renderer

The renderer duplicates hidden-height logic for drawing the obscured part of a target. It matches the simple centered target case, but it can drift when side offsets, size variation, or future model changes are introduced.

Recommended approach:

- Move reusable target visibility helpers into the core model layer.
- Have the renderer consume the same computed values or a shared function.

### 7. Preserve Example Artifacts as First-Class Validation Inputs

Keep the screenshots and README in `examples/1`, but add a small machine-readable fixture beside them.

Suggested file:

`examples/1/fixture.json`

Suggested contents:

- Source URL
- Inputs
- Expected outputs
- Notes about precision and screenshot origin

This lets future example folders follow the same structure.

## Suggested Priority

1. Golden regression fixture for Example 1
2. UI controls for camera aim, diagonal FOV, and show-data toggles
3. Measurement-faithful projection mode
4. Field-specific formatting parity
5. Shared visibility helpers
6. Machine-readable fixture files for all examples

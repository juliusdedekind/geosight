import { useState, type CSSProperties, type PointerEvent } from "react";
import { useCurveStore } from "../state/curveStore";
import { CurvatureScene } from "../visualization/CurvatureScene";
import { ControlPanelControls } from "./ControlPanelControls";
import { DataPanels } from "./DataPanels";

const defaultControlWidth = 560;
const minControlWidth = 420;
const maxControlWidth = 860;
const controlWidthStorageKey = "geosight.controlWidth";

export function App() {
  const exportState = useCurveStore((state) => state.exportState);
  const importState = useCurveStore((state) => state.importState);
  const [stateText, setStateText] = useState("");
  const [stateMessage, setStateMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [controlWidth, setControlWidth] = useState(readStoredControlWidth);

  const exportCurrentState = () => {
    setStateText(exportState());
    setStateMessage({ ok: true, text: "Current state exported." });
  };

  const restoreState = () => {
    const result = importState(stateText);
    setStateMessage({ ok: result.ok, text: result.message });
  };

  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startWidth = controlWidth;
    event.currentTarget.setPointerCapture(pointerId);

    const resize = (moveEvent: globalThis.PointerEvent) => {
      const nextWidth = clampControlWidth(startWidth - (moveEvent.clientX - startX));
      setControlWidth(nextWidth);
      window.localStorage.setItem(controlWidthStorageKey, String(nextWidth));
    };

    const stopResize = () => {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };

    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  };

  return (
    <main className="app-shell" style={{ "--control-width": `${controlWidth}px` } as CSSProperties}>
      <section className="scene-region" aria-label="Visualization">
        <CurvatureScene />
      </section>
      <div
        className="control-resizer"
        role="separator"
        aria-label="Resize calculator controls"
        aria-orientation="vertical"
        aria-valuemin={minControlWidth}
        aria-valuemax={maxControlWidth}
        aria-valuenow={controlWidth}
        onPointerDown={startResize}
      />
      <aside className="control-region" aria-label="Calculator controls">
        <header className="app-header">
          <div>
            <p className="eyebrow">Local port</p>
            <h1>GeoSight: Earth Curvature and Horizon Simulator</h1>
          </div>
          <button type="button" onClick={exportCurrentState}>
            Export State
          </button>
        </header>
        <ControlPanelControls />
        <DataPanels />
        <section className="panel">
          <h2>Save / Restore</h2>
          <textarea
            value={stateText}
            onChange={(event) => {
              setStateText(event.target.value);
              setStateMessage(null);
            }}
            spellCheck={false}
            placeholder="Exported calculator state appears here."
          />
          {stateMessage && (
            <p className={stateMessage.ok ? "state-status success" : "state-status error"} role="status">
              {stateMessage.text}
            </p>
          )}
          <div className="button-row">
            <button type="button" onClick={exportCurrentState}>
              Get State
            </button>
            <button type="button" onClick={restoreState}>
              Set State
            </button>
            <button
              type="button"
              onClick={() => {
                setStateText("");
                setStateMessage(null);
              }}
            >
              Clear
            </button>
          </div>
        </section>
      </aside>
    </main>
  );
}

function readStoredControlWidth(): number {
  if (typeof window === "undefined") return defaultControlWidth;
  const stored = Number(window.localStorage.getItem(controlWidthStorageKey));
  if (!Number.isFinite(stored)) return defaultControlWidth;
  return clampControlWidth(stored);
}

function clampControlWidth(value: number): number {
  return Math.min(maxControlWidth, Math.max(minControlWidth, value));
}

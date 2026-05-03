import { useState } from "react";
import { useCurveStore } from "../state/curveStore";
import { CurvatureScene } from "../visualization/CurvatureScene";
import { DataPanels } from "./DataPanels";
import { InputPanels } from "./InputPanels";

export function App() {
  const exportState = useCurveStore((state) => state.exportState);
  const importState = useCurveStore((state) => state.importState);
  const [stateText, setStateText] = useState("");
  const [stateMessage, setStateMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const exportCurrentState = () => {
    setStateText(exportState());
    setStateMessage({ ok: true, text: "Current state exported." });
  };

  const restoreState = () => {
    const result = importState(stateText);
    setStateMessage({ ok: result.ok, text: result.message });
  };

  return (
    <main className="app-shell">
      <section className="scene-region" aria-label="Visualization">
        <CurvatureScene />
      </section>
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
        <InputPanels />
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

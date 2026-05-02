import { useState } from "react";
import { useCurveStore } from "../state/curveStore";
import { CurvatureScene } from "../visualization/CurvatureScene";
import { DataPanels } from "./DataPanels";
import { InputPanels } from "./InputPanels";

export function App() {
  const exportState = useCurveStore((state) => state.exportState);
  const importState = useCurveStore((state) => state.importState);
  const [stateText, setStateText] = useState("");

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
          <button type="button" onClick={() => setStateText(exportState())}>
            Export State
          </button>
        </header>
        <InputPanels />
        <DataPanels />
        <section className="panel">
          <h2>Save / Restore</h2>
          <textarea
            value={stateText}
            onChange={(event) => setStateText(event.target.value)}
            spellCheck={false}
            placeholder="Exported calculator state appears here."
          />
          <div className="button-row">
            <button type="button" onClick={() => setStateText(exportState())}>
              Get State
            </button>
            <button type="button" onClick={() => importState(stateText)}>
              Set State
            </button>
            <button type="button" onClick={() => setStateText("")}>
              Clear
            </button>
          </div>
        </section>
      </aside>
    </main>
  );
}

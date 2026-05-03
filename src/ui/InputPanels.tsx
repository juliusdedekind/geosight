import { useEffect, useState, type ChangeEvent, type FocusEvent } from "react";
import { gradientUnits, heightUnits, lengthUnits, type AngleFormat, type UnitsType } from "../core/units";
import type { ObjectType, RefractionSync, ShowModel, VariationType } from "../core/curvatureModel";
import { useCurveStore } from "../state/curveStore";

export function InputPanels() {
  const inputs = useCurveStore((state) => state.inputs);
  const updateInput = useCurveStore((state) => state.updateInput);
  const updateInputs = useCurveStore((state) => state.updateInputs);
  const updateArrayInput = useCurveStore((state) => state.updateArrayInput);
  const reset = useCurveStore((state) => state.reset);

  return (
    <>
      <section className="panel">
        <h2>Basics</h2>
        <UnitNumberField label="Observer height" value={inputs.height} unitKind="height" unitsType={inputs.unitsType} min={0.001} max={10000} step={0.1} slider onChange={(value) => updateInput("height", value)} />
        <UnitNumberField label="Target distance" value={inputs.objectSurfaceDistances[0]} unitKind="length" unitsType={inputs.unitsType} min={0} max={100000} step={100} slider onChange={(value) => updateArrayInput("objectSurfaceDistances", 0, value)} />
        <UnitNumberField label="Target size" value={inputs.objectSizes[0]} unitKind="height" unitsType={inputs.unitsType} min={0.001} max={10000} step={1} slider onChange={(value) => updateArrayInput("objectSizes", 0, value)} />
        <NumberField label="Zoom" value={inputs.focalLengthField} unit="mm" min={21} max={10000} step={10} slider onChange={(value) => updateInput("focalLengthField", value)} />
        <label className="field">
          <span>Model</span>
          <select value={inputs.showModel} onChange={(event) => updateInput("showModel", Number(event.target.value) as ShowModel)}>
            <option value={1}>Globe</option>
            <option value={2}>Flat Earth</option>
            <option value={3}>Globe + Flat</option>
            <option value={4}>Side by side</option>
          </select>
        </label>
        <div className="button-row">
          <button type="button" onClick={() => updateInput("refractionSync", 2)}>
            Std Refraction
          </button>
          <button type="button" onClick={() => updateInputs({ refractionSync: 0, refractionCoeff: 0 })}>
            Zero Refraction
          </button>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>View</h2>
        <NumberField label="Pan" value={inputs.pan} unit="deg" min={-180} max={180} step={1} slider onChange={(value) => updateInput("pan", value)} />
        <NumberField label="Tilt" value={inputs.tilt} unit="deg" min={-85} max={45} step={1} slider onChange={(value) => updateInput("tilt", value)} />
        <NumberField label="Device ratio" value={inputs.deviceRatio} min={0.1} step={0.1} onChange={(value) => updateInput("deviceRatio", value)} />
        <label className="check-row">
          <input type="checkbox" checked={inputs.showTheodolite} onChange={(event) => updateInput("showTheodolite", event.target.checked)} />
          Theodolite overlay
        </label>
        <label className="check-row">
          <input type="checkbox" checked={inputs.showLeftRightDrop} onChange={(event) => updateInput("showLeftRightDrop", event.target.checked)} />
          Left-right horizon drop
        </label>
      </section>

      {[0, 1].map((index) => (
        <section className="panel" key={index}>
          <h2>Target {index + 1}</h2>
          <NumberField label="Objects" value={inputs.objectCounts[index as 0 | 1]} min={0} max={500} step={1} onChange={(value) => updateArrayInput("objectCounts", index as 0 | 1, value)} />
          <UnitNumberField label="Distance" value={inputs.objectSurfaceDistances[index as 0 | 1]} unitKind="length" unitsType={inputs.unitsType} min={0} max={100000} step={100} slider onChange={(value) => updateArrayInput("objectSurfaceDistances", index as 0 | 1, value)} />
          <UnitNumberField label="Size" value={inputs.objectSizes[index as 0 | 1]} unitKind="height" unitsType={inputs.unitsType} min={0.001} max={10000} step={1} slider onChange={(value) => updateArrayInput("objectSizes", index as 0 | 1, value)} />
          <UnitNumberField label="Delta distance" value={inputs.objectDeltaDistances[index as 0 | 1]} unitKind="length" unitsType={inputs.unitsType} min={0.001} max={10000} step={10} slider onChange={(value) => updateArrayInput("objectDeltaDistances", index as 0 | 1, value)} />
          <UnitNumberField label="Side position" value={inputs.objectSidePositions[index as 0 | 1]} unitKind="length" unitsType={inputs.unitsType} min={-50000} max={50000} step={10} slider onChange={(value) => updateArrayInput("objectSidePositions", index as 0 | 1, value)} />
          <UnitNumberField label="Side variation" value={inputs.objectSideVariations[index as 0 | 1]} unitKind="length" unitsType={inputs.unitsType} min={-50000} max={50000} step={10} slider onChange={(value) => updateArrayInput("objectSideVariations", index as 0 | 1, value)} />
          <NumberField label="Size variation" value={inputs.objectSizeVariations[index as 0 | 1]} min={-1} max={1} step={0.01} slider onChange={(value) => updateArrayInput("objectSizeVariations", index as 0 | 1, value)} />
          <label className="field">
            <span>Type</span>
            <select
              value={inputs.targetTypes[index as 0 | 1]}
              onChange={(event) => updateArrayInput("targetTypes", index as 0 | 1, Number(event.target.value) as ObjectType)}
            >
              <option value={0}>M-Rod</option>
              <option value={1}>Mountain</option>
            </select>
          </label>
          <VariationSelect
            label="Side variation mode"
            value={inputs.objectSideTypes[index as 0 | 1]}
            onChange={(value) => updateArrayInput("objectSideTypes", index as 0 | 1, value)}
          />
          <VariationSelect
            label="Size variation mode"
            value={inputs.objectSizeTypes[index as 0 | 1]}
            onChange={(value) => updateArrayInput("objectSizeTypes", index as 0 | 1, value)}
          />
        </section>
      ))}

      <section className="panel">
        <h2>Refraction</h2>
        <label className="field">
          <span>BaroLink</span>
          <select value={inputs.refractionSync} onChange={(event) => updateInput("refractionSync", Number(event.target.value) as RefractionSync)}>
            <option value={0}>off</option>
            <option value={1}>T,P</option>
            <option value={2}>Std-Atm</option>
            <option value={3}>k=0.13</option>
            <option value={4}>k=0.17</option>
            <option value={5}>a=7/6</option>
            <option value={6}>a=7/2</option>
          </select>
        </label>
        <NumberField label="Coeff. k" value={inputs.refractionCoeff} min={-1} max={1} step={0.01} onChange={(value) => updateInput("refractionCoeff", value)} />
        <UnitNumberField label="dT/dh" value={inputs.temperatureGradient} unitKind="gradient" unitsType={inputs.unitsType} step={0.0001} onChange={(value) => updateInput("temperatureGradient", value)} />
        <NumberField label="Temperature" value={inputs.temperatureC} unit="deg C" step={0.1} onChange={(value) => updateInput("temperatureC", value)} />
        <NumberField label="Pressure" value={inputs.pressureMbar} unit="mbar" step={10} onChange={(value) => updateInput("pressureMbar", value)} />
      </section>

      <section className="panel">
        <h2>Units</h2>
        <label className="field">
          <span>Units</span>
          <select value={inputs.unitsType} onChange={(event) => updateInput("unitsType", Number(event.target.value) as UnitsType)}>
            <option value={0}>m / km</option>
            <option value={1}>mi / ft</option>
            <option value={2}>ft / ft</option>
          </select>
        </label>
        <label className="field">
          <span>Angle format</span>
          <select value={inputs.angleFormat} onChange={(event) => updateInput("angleFormat", Number(event.target.value) as AngleFormat)}>
            <option value={0}>deg.</option>
            <option value={1}>DM</option>
            <option value={2}>DMS</option>
          </select>
        </label>
      </section>
    </>
  );
}

function NumberField(props: {
  label: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(formatInputValue(props.value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setDraft(formatInputValue(props.value));
  }, [isEditing, props.value]);

  const commit = (value: string) => {
    if (value.trim() === "" || value === "-" || value === "." || value === "-.") return;
    const next = Number(value);
    if (Number.isFinite(next)) props.onChange(next);
  };

  const blur = (event: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    if (event.target.value.trim() === "") {
      setDraft(formatInputValue(props.value));
    }
  };

  return (
    <label className="field">
      <span>{props.label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={draft}
        min={props.min}
        max={props.max}
        step={props.step ?? "any"}
        onFocus={() => setIsEditing(true)}
        onBlur={blur}
        onChange={(event) => {
          setDraft(event.target.value);
          commit(event.target.value);
        }}
      />
      {props.unit && <b>{props.unit}</b>}
      {props.slider && props.min !== undefined && props.max !== undefined && (
        <input
          className="field-slider"
          type="range"
          min={props.min}
          max={props.max}
          step={props.step ?? "any"}
          value={clamp(props.value, props.min, props.max)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(Number(event.target.value))}
        />
      )}
    </label>
  );
}

function UnitNumberField(props: {
  label: string;
  value: number;
  unitKind: "length" | "height" | "gradient";
  unitsType: UnitsType;
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
  onChange: (baseValue: number) => void;
}) {
  const table =
    props.unitKind === "length" ? lengthUnits : props.unitKind === "height" ? heightUnits : gradientUnits;
  const mult = table.mults[props.unitsType];
  const displayValue = props.value / mult;
  const unit = table.units[props.unitsType];

  return (
    <NumberField
      label={props.label}
      value={displayValue}
      unit={unit}
      min={props.min === undefined ? undefined : props.min / mult}
      max={props.max === undefined ? undefined : props.max / mult}
      step={props.step === undefined ? undefined : props.step / mult}
      slider={props.slider}
      onChange={(value) => props.onChange(value * mult)}
    />
  );
}

function formatInputValue(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 1000) return String(Number(value.toFixed(6)));
  return String(Number(value.toFixed(8)));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function VariationSelect(props: {
  label: string;
  value: VariationType;
  onChange: (value: VariationType) => void;
}) {
  return (
    <label className="field">
      <span>{props.label}</span>
      <select value={props.value} onChange={(event) => props.onChange(Number(event.target.value) as VariationType)}>
        <option value={0}>Lin</option>
        <option value={1}>2-Col / Alt</option>
        <option value={2}>Rand</option>
        <option value={3}>Cos</option>
        <option value={4}>Sin</option>
      </select>
    </label>
  );
}

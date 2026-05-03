import { create } from "zustand";
import { computeCurve, defaultInputs, type CurveInputs, type CurveOutputs } from "../core/curvatureModel";

export interface ImportStateResult {
  ok: boolean;
  message: string;
}

interface CurveState {
  inputs: CurveInputs;
  outputs: CurveOutputs;
  updateInput: <K extends keyof CurveInputs>(key: K, value: CurveInputs[K]) => void;
  updateInputs: (patch: Partial<CurveInputs>) => void;
  updateArrayInput: <K extends keyof CurveInputs>(key: K, index: 0 | 1, value: number) => void;
  reset: () => void;
  importState: (json: string) => ImportStateResult;
  exportState: () => string;
}

function nextState(inputs: CurveInputs): Pick<CurveState, "inputs" | "outputs"> {
  return {
    inputs,
    outputs: computeCurve(inputs),
  };
}

export const useCurveStore = create<CurveState>((set, get) => ({
  ...nextState(defaultInputs),
  updateInput: (key, value) =>
    set((state) => {
      const inputs = { ...state.inputs, [key]: value };
      return nextState(inputs);
    }),
  updateInputs: (patch) =>
    set((state) => {
      const inputs = { ...state.inputs, ...patch };
      return nextState(inputs);
    }),
  updateArrayInput: (key, index, value) =>
    set((state) => {
      const current = state.inputs[key];
      if (!Array.isArray(current)) return state;
      const next = [...current] as [number, number];
      next[index] = value;
      const inputs = { ...state.inputs, [key]: next };
      return nextState(inputs);
    }),
  reset: () => set(nextState(defaultInputs)),
  importState: (json) => {
    const result = parseImportedInputs(json);
    if (!result.ok) return result;
    set((state) => nextState({ ...state.inputs, ...result.inputs }));
    return { ok: true, message: "State restored." };
  },
  exportState: () => JSON.stringify(get().inputs, null, 2),
}));

type ImportParseResult =
  | { ok: true; inputs: Partial<CurveInputs> }
  | { ok: false; message: string };

const numberKeys = [
  "height",
  "focalLengthField",
  "deviceRatio",
  "refractionCoeff",
  "temperatureGradient",
  "pressureMbar",
  "temperatureC",
  "refractionFactMin",
  "refractionFactMax",
  "radiusEarth",
  "equatorRadiusFE",
  "tilt",
  "pan",
] as const;

const booleanKeys = [
  "showTheodolite",
  "showDataObject",
  "showDataRefraction",
  "showDataHorizon",
  "showLeftRightDrop",
] as const;

const numberPairKeys = [
  "objectCounts",
  "objectSurfaceDistances",
  "objectDeltaDistances",
  "objectSidePositions",
  "objectSideVariations",
  "objectSizes",
  "objectSizeVariations",
] as const;

const enumPairKeys = {
  targetTypes: [0, 1],
  objectSideTypes: [0, 1, 2, 3, 4],
  objectSizeTypes: [0, 1, 2, 3, 4],
} as const;

const enumKeys = {
  showModel: [1, 2, 3, 4],
  viewcenterHorizon: [0, 1, 2, 3],
  refractionSync: [0, 1, 2, 3, 4, 5, 6],
  unitsType: [0, 1, 2],
  angleFormat: [0, 1, 2],
  numberFormat: [0, 1, 2, 3],
} as const;

function parseImportedInputs(json: string): ImportParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, message: "State JSON is not valid." };
  }

  if (!isRecord(parsed)) {
    return { ok: false, message: "State must be a JSON object." };
  }

  const inputs: Partial<CurveInputs> = {};
  let recognizedKeys = 0;

  for (const key of numberKeys) {
    if (!(key in parsed)) continue;
    recognizedKeys++;
    const value = parsed[key];
    if (!isFiniteNumber(value)) return invalidKey(key);
    inputs[key] = value;
  }

  for (const key of booleanKeys) {
    if (!(key in parsed)) continue;
    recognizedKeys++;
    const value = parsed[key];
    if (typeof value !== "boolean") return invalidKey(key);
    inputs[key] = value;
  }

  for (const key of numberPairKeys) {
    if (!(key in parsed)) continue;
    recognizedKeys++;
    const value = parsed[key];
    if (!isNumberPair(value)) return invalidKey(key);
    inputs[key] = value;
  }

  for (const key of typedKeys(enumKeys)) {
    if (!(key in parsed)) continue;
    recognizedKeys++;
    const value = parsed[key];
    if (!isAllowedNumber(value, enumKeys[key])) return invalidKey(key);
    inputs[key] = value as never;
  }

  for (const key of typedKeys(enumPairKeys)) {
    if (!(key in parsed)) continue;
    recognizedKeys++;
    const value = parsed[key];
    if (!isEnumPair(value, enumPairKeys[key])) return invalidKey(key);
    inputs[key] = value as never;
  }

  if (recognizedKeys === 0) {
    return { ok: false, message: "State does not contain any calculator settings." };
  }

  return { ok: true, inputs };
}

function typedKeys<T extends object>(value: T): Array<keyof T> {
  return Object.keys(value) as Array<keyof T>;
}

function invalidKey(key: keyof CurveInputs): ImportParseResult {
  return { ok: false, message: `Invalid value for "${key}".` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNumberPair(value: unknown): value is [number, number] {
  return Array.isArray(value) && value.length === 2 && value.every(isFiniteNumber);
}

function isAllowedNumber<T extends readonly number[]>(value: unknown, allowed: T): value is T[number] {
  return isFiniteNumber(value) && allowed.includes(value);
}

function isEnumPair<T extends readonly number[]>(value: unknown, allowed: T): value is [T[number], T[number]] {
  return Array.isArray(value) && value.length === 2 && value.every((item) => isAllowedNumber(item, allowed));
}

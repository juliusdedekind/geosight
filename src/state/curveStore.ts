import { create } from "zustand";
import { computeCurve, defaultInputs, type CurveInputs, type CurveOutputs } from "../core/curvatureModel";

interface CurveState {
  inputs: CurveInputs;
  outputs: CurveOutputs;
  updateInput: <K extends keyof CurveInputs>(key: K, value: CurveInputs[K]) => void;
  updateArrayInput: <K extends keyof CurveInputs>(key: K, index: 0 | 1, value: number) => void;
  reset: () => void;
  importState: (json: string) => void;
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
  importState: (json) =>
    set((state) => {
      const parsed = JSON.parse(json) as Partial<CurveInputs>;
      const inputs = { ...state.inputs, ...parsed };
      return nextState(inputs);
    }),
  exportState: () => JSON.stringify(get().inputs, null, 2),
}));

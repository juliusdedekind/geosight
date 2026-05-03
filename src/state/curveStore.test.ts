import { beforeEach, describe, expect, it } from "vitest";
import { useCurveStore } from "./curveStore";

describe("curveStore", () => {
  beforeEach(() => {
    useCurveStore.getState().reset();
  });

  it("clears standard-atmosphere refraction when switching to zero refraction", () => {
    useCurveStore.getState().updateInput("refractionSync", 2);
    expect(useCurveStore.getState().outputs.refractionCoeff).toBeGreaterThan(0);

    useCurveStore.getState().updateInputs({ refractionSync: 0, refractionCoeff: 0 });

    const state = useCurveStore.getState();
    expect(state.inputs.refractionSync).toBe(0);
    expect(state.outputs.refractionCoeff).toBe(0);
  });

  it("rejects invalid JSON without changing state", () => {
    const before = useCurveStore.getState().exportState();
    const result = useCurveStore.getState().importState("{bad json");

    expect(result.ok).toBe(false);
    expect(result.message).toBe("State JSON is not valid.");
    expect(useCurveStore.getState().exportState()).toBe(before);
  });

  it("rejects wrong-shaped imported settings without poisoning outputs", () => {
    const result = useCurveStore.getState().importState('{"objectSizes":"oops"}');

    expect(result.ok).toBe(false);
    expect(result.message).toBe('Invalid value for "objectSizes".');
    expect(useCurveStore.getState().inputs.objectSizes).toEqual([10, 10]);
    expect(useCurveStore.getState().outputs.objectVisible).not.toBeNaN();
  });

  it("restores valid partial state", () => {
    const result = useCurveStore.getState().importState('{"height":5,"showTheodolite":true}');

    expect(result.ok).toBe(true);
    expect(useCurveStore.getState().inputs.height).toBe(5);
    expect(useCurveStore.getState().inputs.showTheodolite).toBe(true);
  });
});

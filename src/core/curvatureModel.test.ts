import { describe, expect, it } from "vitest";
import { computeCurve, defaultInputs } from "./curvatureModel";

describe("computeCurve", () => {
  it("computes default horizon and target values", () => {
    const result = computeCurve(defaultInputs);
    expect(result.horizonSurfaceDistance).toBeGreaterThan(5000);
    expect(result.horizonSurfaceDistance).toBeLessThan(5100);
    expect(result.objectHidden).toBeGreaterThan(3.7);
    expect(result.objectHidden).toBeLessThan(3.9);
    expect(result.objectVisible).toBeGreaterThan(6);
    expect(result.refractionCoeff).toBe(0);
  });

  it("shows left-right horizon drop data by default to match the original calculator", () => {
    expect(defaultInputs.showLeftRightDrop).toBe(true);
  });

  it("applies standard atmosphere refraction", () => {
    const result = computeCurve({ ...defaultInputs, refractionSync: 2 });
    expect(result.refractionCoeff).toBeGreaterThan(0.1);
    expect(result.refractedRadiusEarth).toBeGreaterThan(defaultInputs.radiusEarth);
  });
});

import { describe, expect, it } from "vitest";
import { computeCurve, defaultInputs, type CurveInputs } from "../core/curvatureModel";
import { computeCamera, flatHorizonDistance, JsgLikeCamera, worldPointOnPlane } from "./jsgProjection";

describe("computeCamera", () => {
  it("can aim a flat-earth panel at the projected flat horizon", () => {
    const inputs: CurveInputs = { ...defaultInputs, height: 302.201, refractionSync: 2 };
    const outputs = computeCurve(inputs);
    const flatHorizon = worldPointOnPlane(flatHorizonDistance(outputs), 0, 0, inputs.height);

    const flatCamera = new JsgLikeCamera(computeCamera(inputs, outputs, "flatHorizon"));
    const globeCamera = new JsgLikeCamera(computeCamera(inputs, outputs, "globeHorizon"));

    expect(flatCamera.project(flatHorizon)?.[1]).toBeCloseTo(0, 10);
    expect(Math.abs(globeCamera.project(flatHorizon)?.[1] ?? 0)).toBeGreaterThan(0.001);
  });
});

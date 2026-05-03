import { describe, expect, it } from "vitest";
import { computeCurve, defaultInputs, type CurveInputs } from "../core/curvatureModel";
import {
  curvatureDrop,
  flatTargetTopAngle,
  focalLengthFromViewAngleDeg,
  greatCircleSurfaceDistance,
  hiddenHeightFromLineOfSightDistance,
  hiddenHeightFromSurfaceDistance,
  horizon,
  horizonRefractionAngle,
  leftRightHorizonDrop,
  lineOfSightClearing,
  objectRefractionAngle,
  refractedRadius,
  refractionCoeffFromAtmosphere,
  standardAtmosphereReference,
  targetTopAngle,
  temperatureGradientFromRefraction,
  toDeg,
  viewAngleDegFromFocalLength,
} from "./bislinReference";

function expectClose(actual: number, expected: number, relativeTolerance = 1e-10): void {
  const tolerance = Math.max(1e-9, Math.max(1, Math.abs(expected)) * relativeTolerance);
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

function curveInputs(overrides: Partial<CurveInputs> = {}): CurveInputs {
  return {
    ...defaultInputs,
    refractionSync: 0,
    ...overrides,
  } as CurveInputs;
}

describe("Bislin formula requirements", () => {
  it("matches refracted radius and 35 mm equivalent field-of-view equations", () => {
    const inputs = curveInputs({
      height: 10,
      focalLengthField: 1500,
      refractionCoeff: 0.17,
      objectCounts: [0, 0],
    });

    const outputs = computeCurve(inputs);
    const expectedViewAngle = viewAngleDegFromFocalLength(inputs.focalLengthField);

    expectClose(outputs.refractedRadiusEarth, refractedRadius(inputs.radiusEarth, inputs.refractionCoeff));
    expectClose(outputs.refractionFactor, 1 / (1 - inputs.refractionCoeff));
    expectClose(outputs.viewAngle, expectedViewAngle);
    expectClose(outputs.focalLength, focalLengthFromViewAngleDeg(expectedViewAngle));
    expectClose(outputs.temperatureGradient, temperatureGradientFromRefraction(inputs.refractionCoeff, inputs.pressureMbar, inputs.temperatureC));
  });

  it("matches exact horizon-distance, drop, and refraction-angle formulas", () => {
    const inputs = curveInputs({
      height: 35.5,
      refractionCoeff: 0.13,
      objectCounts: [0, 0],
    });

    const outputs = computeCurve(inputs);
    const expectedHorizon = horizon(inputs.radiusEarth, inputs.height, inputs.refractionCoeff);

    expectClose(outputs.horizonDropAngleDeg, toDeg(expectedHorizon.angle));
    expectClose(outputs.horizonSurfaceDistance, expectedHorizon.surfaceDistance);
    expectClose(outputs.horizonDistanceLineOfSight, expectedHorizon.distanceLineOfSight);
    expectClose(outputs.horizonDistanceOnEyeLevel, expectedHorizon.distanceOnEyeLevel);
    expectClose(outputs.horizonDropFromObserverSurface, expectedHorizon.dropFromObserverSurface);
    expectClose(outputs.horizonDropFromEyeLevel, expectedHorizon.dropFromEyeLevel);
    expectClose(outputs.horizonRefrAngleDeg, toDeg(horizonRefractionAngle(inputs.radiusEarth, inputs.height, inputs.refractionCoeff)));
  });

  it("matches exact curvature drop, hidden height, visible height, and top angle for a target behind the horizon", () => {
    const targetDistance = 12_000;
    const targetHeight = 10;
    const inputs = curveInputs({
      height: 2,
      refractionCoeff: 0,
      objectCounts: [1, 0],
      objectSurfaceDistances: [targetDistance, 20_000],
      objectSidePositions: [0, 0],
      objectSizes: [targetHeight, 10],
    });

    const outputs = computeCurve(inputs);
    const expectedHidden = hiddenHeightFromSurfaceDistance(targetDistance, inputs.radiusEarth, inputs.height, inputs.refractionCoeff);

    expectClose(outputs.objectDropFromObserverSurface, curvatureDrop(targetDistance, inputs.radiusEarth, inputs.refractionCoeff));
    expectClose(outputs.objectHidden, expectedHidden);
    expectClose(outputs.objectVisible, Math.max(0, targetHeight - expectedHidden));
    expectClose(outputs.objectTopAngleDeg, toDeg(targetTopAngle(targetDistance, inputs.radiusEarth, inputs.height, targetHeight, inputs.refractionCoeff)));
    expectClose(outputs.objectTopAngleFlatDeg, toDeg(flatTargetTopAngle(targetDistance, inputs.height, targetHeight)));
    expectClose(
      hiddenHeightFromLineOfSightDistance(outputs.horizonDistanceLineOfSight + 1000, inputs.radiusEarth, inputs.height, inputs.refractionCoeff),
      Math.sqrt(1000 ** 2 + inputs.radiusEarth ** 2) - inputs.radiusEarth,
    );
  });

  it("uses great-circle surface distance when the target has side offset", () => {
    const forwardDistance = 18_500;
    const sideDistance = 4_250;
    const targetHeight = 35;
    const inputs = curveInputs({
      height: 8,
      refractionCoeff: 0.17,
      objectCounts: [1, 0],
      objectSurfaceDistances: [forwardDistance, 20_000],
      objectSidePositions: [sideDistance, 0],
      objectSizes: [targetHeight, 10],
    });

    const outputs = computeCurve(inputs);
    const realSurfaceDistance = greatCircleSurfaceDistance(forwardDistance, sideDistance, outputs.refractedRadiusEarth);
    const expectedHidden = hiddenHeightFromSurfaceDistance(realSurfaceDistance, inputs.radiusEarth, inputs.height, inputs.refractionCoeff);

    expectClose(outputs.objectDropFromObserverSurface, curvatureDrop(realSurfaceDistance, inputs.radiusEarth, inputs.refractionCoeff));
    expectClose(outputs.objectHidden, expectedHidden);
    expectClose(outputs.objectVisible, Math.max(0, targetHeight - expectedHidden));
    expectClose(outputs.objectTopAngleDeg, toDeg(targetTopAngle(realSurfaceDistance, inputs.radiusEarth, inputs.height, targetHeight, inputs.refractionCoeff)));
  });

  it("derives standard-atmosphere refraction from pressure, temperature, and lapse rate", () => {
    const inputs = curveInputs({
      height: 2500,
      refractionSync: 2,
      objectCounts: [0, 0],
    });

    const outputs = computeCurve(inputs);
    const atmosphere = standardAtmosphereReference(inputs.height);
    const expectedRefractionCoeff = refractionCoeffFromAtmosphere(atmosphere.pressureMbar, atmosphere.temperatureC, atmosphere.gradient);

    expectClose(outputs.temperatureC, atmosphere.temperatureC);
    expectClose(outputs.pressureMbar, atmosphere.pressureMbar);
    expectClose(outputs.temperatureGradient, atmosphere.gradient);
    expectClose(outputs.refractionCoeff, expectedRefractionCoeff);
    expectClose(outputs.refractedRadiusEarth, refractedRadius(inputs.radiusEarth, expectedRefractionCoeff));
  });

  it("matches left-right horizon drop and line-of-sight clearing formulas", () => {
    const targetDistance = 32_000;
    const targetHeight = 120;
    const inputs = curveInputs({
      height: 120,
      focalLengthField: 800,
      refractionCoeff: 0.13,
      objectCounts: [1, 0],
      objectSurfaceDistances: [targetDistance, 20_000],
      objectSidePositions: [0, 0],
      objectSizes: [targetHeight, 10],
    });

    const outputs = computeCurve(inputs);
    const expectedHorizon = horizon(inputs.radiusEarth, inputs.height, inputs.refractionCoeff);
    const expectedLeftRight = leftRightHorizonDrop(
      expectedHorizon.distanceLineOfSight,
      expectedHorizon.distanceOnEyeLevel,
      expectedHorizon.dropFromEyeLevel,
      expectedHorizon.angle,
      outputs.viewAngle,
      inputs.deviceRatio,
    );
    const expectedObjectRefractionAngle = objectRefractionAngle(targetDistance, 0, inputs.radiusEarth, inputs.height, inputs.refractionCoeff);

    expectClose(outputs.leftRightWidth, expectedLeftRight.width);
    expectClose(outputs.leftRightWidthAngleDeg, expectedLeftRight.widthAngleDeg);
    expectClose(outputs.leftRightDrop, expectedLeftRight.drop);
    expectClose(outputs.leftRightDropAngleDeg, expectedLeftRight.dropAngleDeg);
    expectClose(outputs.objectRefractionAngleDeg, toDeg(expectedObjectRefractionAngle));
    expectClose(outputs.lineOfSightClearing, lineOfSightClearing(inputs.radiusEarth, inputs.height, targetHeight, targetDistance));
    expectClose(outputs.lineOfSightClearingRefracted, lineOfSightClearing(outputs.refractedRadiusEarth, inputs.height, targetHeight, targetDistance));
  });
});

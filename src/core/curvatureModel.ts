import { standardAtmosphere } from "./atmosphere";
import { objectVector, PI90, sub, toDeg, toRad, vectorAngle } from "./math";
import type { AngleFormat, NumberFormat, UnitsType } from "./units";

export type ShowModel = 1 | 2 | 3 | 4;
export type RefractionSync = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ObjectType = 0 | 1;
export type VariationType = 0 | 1 | 2 | 3 | 4;

export interface CurveInputs {
  height: number;
  focalLengthField: number;
  showModel: ShowModel;
  deviceRatio: number;
  viewcenterHorizon: 0 | 1 | 2 | 3;
  targetTypes: [ObjectType, ObjectType];
  objectCounts: [number, number];
  objectSurfaceDistances: [number, number];
  objectDeltaDistances: [number, number];
  objectSideTypes: [VariationType, VariationType];
  objectSidePositions: [number, number];
  objectSideVariations: [number, number];
  objectSizeTypes: [VariationType, VariationType];
  objectSizes: [number, number];
  objectSizeVariations: [number, number];
  refractionCoeff: number;
  temperatureGradient: number;
  refractionSync: RefractionSync;
  pressureMbar: number;
  temperatureC: number;
  refractionFactMin: number;
  refractionFactMax: number;
  radiusEarth: number;
  equatorRadiusFE: number;
  showTheodolite: boolean;
  showDataObject: boolean;
  showDataRefraction: boolean;
  showDataHorizon: boolean;
  showLeftRightDrop: boolean;
  unitsType: UnitsType;
  angleFormat: AngleFormat;
  numberFormat: NumberFormat;
  tilt: number;
  pan: number;
}

export interface CurveOutputs {
  refractionCoeff: number;
  refractionFactor: number;
  refractedRadiusEarth: number;
  temperatureGradient: number;
  pressureMbar: number;
  temperatureC: number;
  viewAngle: number;
  focalLength: number;
  horizonDropAngleDeg: number;
  horizonRefrAngleDeg: number;
  horizonSurfaceDistance: number;
  horizonDistanceLineOfSight: number;
  horizonDistanceOnEyeLevel: number;
  horizonDropFromObserverSurface: number;
  horizonDropFromEyeLevel: number;
  gridSpacing: number;
  bulge: number;
  nearObjectIndex: 0 | 1;
  objectVisible: number;
  objectHidden: number;
  objectVisibleAngleDeg: number;
  objectHiddenAngleDeg: number;
  objectDropFromObserverSurface: number;
  objectDropAngleDeg: number;
  objectSizeAngleDeg: number;
  objectRefractionAngleDeg: number;
  objectLiftAbsolute: number;
  objectLiftRelativeToHorizon: number;
  horizonLift: number;
  objectTopAngleDeg: number;
  objectTopAngleFlatDeg: number;
  objectNearTiltDeg: number;
  lineOfSightClearing: number;
  lineOfSightClearingRefracted: number;
  leftRightWidth: number;
  leftRightWidthAngleDeg: number;
  leftRightDrop: number;
  leftRightDropAngleDeg: number;
  sceneWidth: number;
  sceneHeight: number;
}

export const defaultInputs: CurveInputs = {
  height: 2,
  focalLengthField: 3000,
  showModel: 1,
  deviceRatio: 1.5,
  viewcenterHorizon: 0,
  targetTypes: [0, 0],
  objectCounts: [1, 0],
  objectSurfaceDistances: [12000, 20000],
  objectDeltaDistances: [300, 300],
  objectSideTypes: [0, 0],
  objectSidePositions: [0, 0],
  objectSideVariations: [0, 0],
  objectSizeTypes: [1, 1],
  objectSizes: [10, 10],
  objectSizeVariations: [0, 0],
  refractionCoeff: 0,
  temperatureGradient: -0.0343,
  refractionSync: 0,
  pressureMbar: 1013.25,
  temperatureC: 15,
  refractionFactMin: 0.5,
  refractionFactMax: 10000,
  radiusEarth: 6371000,
  equatorRadiusFE: 10007543,
  showTheodolite: false,
  showDataObject: true,
  showDataRefraction: true,
  showDataHorizon: true,
  showLeftRightDrop: false,
  unitsType: 0,
  angleFormat: 0,
  numberFormat: 0,
  tilt: 0,
  pan: 0,
};

export function getObjectSizeVar(inputs: CurveInputs, objectIndex: 0 | 1): number {
  if (inputs.targetTypes[objectIndex] !== 0) return 1;
  let sizeVar = inputs.objectSizeVariations[objectIndex];
  if (sizeVar < 0) return Math.max(0.1, 1 + sizeVar);
  return 10 * sizeVar + 1;
}

export function computeCurve(inputs: CurveInputs): CurveOutputs {
  const radiusEarth = Math.max(100000, inputs.radiusEarth);
  const height = Math.min(1e9, Math.max(0.001, inputs.height));
  const refractionFactMin = Math.min(1, Math.max(0.1, inputs.refractionFactMin));
  const refractionFactMax = Math.max(10000, inputs.refractionFactMax);
  const kMin = 1 - 1 / refractionFactMin;
  const kMax = 1 - 1 / refractionFactMax;

  let temperatureC = Math.min(100, Math.max(-100, inputs.temperatureC));
  let pressureMbar = Math.min(1200, Math.max(0.001, inputs.pressureMbar));
  let temperatureGradient = inputs.temperatureGradient;
  let refractionCoeff = Math.min(kMax, Math.max(kMin, inputs.refractionCoeff));
  let refractionFactor = 1 / (1 - refractionCoeff);

  if (inputs.refractionSync >= 1) {
    if (height > 84852) {
      temperatureC = -86.204;
      pressureMbar = 0.00373383;
      if (inputs.refractionSync === 2) temperatureGradient = -0.002;
    } else {
      const atmosphere = standardAtmosphere(height);
      temperatureC = atmosphere.temperatureC;
      pressureMbar = atmosphere.pressureMbar;
      if (inputs.refractionSync === 2) temperatureGradient = atmosphere.gradient;
    }
  }

  if (inputs.refractionSync === 3) refractionCoeff = 0.13;
  if (inputs.refractionSync === 4) refractionCoeff = 0.17;
  if (inputs.refractionSync === 5) refractionCoeff = 1 - 1 / (7 / 6);
  if (inputs.refractionSync === 6) refractionCoeff = 1 - 1 / (7 / 2);

  if (inputs.refractionSync === 2 || inputs.refractionSync === 1) {
    const temperatureK = Math.max(3, temperatureC + 273.15);
    refractionCoeff = 503 * (pressureMbar / (temperatureK * temperatureK)) * (0.0343 + temperatureGradient);
  }

  refractionCoeff = Math.abs(refractionCoeff) < 0.000002 ? 0 : Math.min(kMax, Math.max(kMin, refractionCoeff));
  refractionFactor = 1 / (1 - refractionCoeff);
  const refractedRadiusEarth = radiusEarth * refractionFactor;
  const temperatureK = Math.max(3, temperatureC + 273.15);
  temperatureGradient = (refractionCoeff * temperatureK * temperatureK) / (503 * pressureMbar) - 0.0343;
  if (Math.abs(temperatureGradient) < 0.000001) temperatureGradient = 0;

  const diagonal35mmEquivalent = 43.2666153;
  const focalLengthField = Math.max(21, inputs.focalLengthField);
  let viewAngle = toDeg(2 * Math.atan(diagonal35mmEquivalent / 2 / focalLengthField));
  viewAngle = Math.min(160, Math.max(0.1, viewAngle));
  const focalLength = diagonal35mmEquivalent / (2 * Math.tan(toRad(viewAngle) / 2));

  const horizonDropAngle = Math.acos(refractedRadiusEarth / (refractedRadiusEarth + height));
  const horizonDistanceOnEyeLevel = refractedRadiusEarth * Math.sin(horizonDropAngle);
  const horizonSurfaceDistance = refractedRadiusEarth * horizonDropAngle;
  const earthCenterToHorizonDisk = refractedRadiusEarth * Math.cos(horizonDropAngle);
  const horizonDropFromObserverSurface = refractedRadiusEarth - earthCenterToHorizonDisk;
  const horizonDropFromEyeLevel = horizonDropFromObserverSurface + height;
  const horizonDistanceLineOfSight = (height + refractedRadiusEarth) * Math.sin(horizonDropAngle);
  const horizonDipNoRefraction = Math.acos(radiusEarth / (radiusEarth + height));
  const horizonRefrAngle = horizonDipNoRefraction - horizonDropAngle;

  const exponent = Math.floor(Math.log(PI90 / horizonDropAngle) / Math.LN2);
  const gridDeltaAngle = PI90 / Math.pow(2, exponent) / 45;
  const gridSpacing = gridDeltaAngle * refractedRadiusEarth;

  const sceneDiagonal = 2 * horizonDistanceLineOfSight * Math.tan(toRad(viewAngle) / 2);
  const sceneHeight = sceneDiagonal / Math.sqrt(1 + inputs.deviceRatio * inputs.deviceRatio);
  const sceneWidth = inputs.deviceRatio * sceneHeight;

  const yFieldOfView2 = toRad(viewAngle) / Math.sqrt(1 + 1 / (inputs.deviceRatio * inputs.deviceRatio)) / 2;
  const width2HorLRDrop = horizonDistanceLineOfSight * Math.sin(yFieldOfView2);
  let leftRightWidth = 0;
  let leftRightWidthAngleDeg = 0;
  let leftRightDrop = 0;
  let leftRightDropAngleDeg = 0;
  if (width2HorLRDrop < horizonDistanceOnEyeLevel) {
    leftRightWidth = width2HorLRDrop * 2;
    leftRightWidthAngleDeg = toDeg(2 * Math.asin(leftRightWidth / (2 * horizonDistanceLineOfSight)));
    const leftRightDistance = Math.sqrt(horizonDistanceOnEyeLevel ** 2 - width2HorLRDrop ** 2);
    const verticalAngle = Math.atan(leftRightDistance / horizonDropFromEyeLevel);
    const dropAngle = Math.PI / 2 - horizonDropAngle - verticalAngle;
    leftRightDropAngleDeg = toDeg(dropAngle);
    leftRightDrop = horizonDistanceLineOfSight * dropAngle;
  }

  let nearObjectIndex: 0 | 1 = 0;
  if (inputs.objectCounts[0] === 0) nearObjectIndex = 1;
  if (inputs.objectCounts[0] > 0 && inputs.objectCounts[1] > 0 && inputs.objectSurfaceDistances[0] > inputs.objectSurfaceDistances[1]) {
    nearObjectIndex = 1;
  }

  const objIx = nearObjectIndex;
  if (inputs.objectCounts[objIx] <= 0) {
    return {
      refractionCoeff,
      refractionFactor,
      refractedRadiusEarth,
      temperatureGradient,
      pressureMbar,
      temperatureC,
      viewAngle,
      focalLength,
      horizonDropAngleDeg: toDeg(horizonDropAngle),
      horizonRefrAngleDeg: toDeg(horizonRefrAngle),
      horizonSurfaceDistance,
      horizonDistanceLineOfSight,
      horizonDistanceOnEyeLevel,
      horizonDropFromObserverSurface,
      horizonDropFromEyeLevel,
      gridSpacing,
      bulge: 0,
      nearObjectIndex,
      objectVisible: 0,
      objectHidden: 0,
      objectVisibleAngleDeg: 0,
      objectHiddenAngleDeg: 0,
      objectDropFromObserverSurface: 0,
      objectDropAngleDeg: 0,
      objectSizeAngleDeg: 0,
      objectRefractionAngleDeg: toDeg(horizonRefrAngle),
      objectLiftAbsolute: 0,
      objectLiftRelativeToHorizon: 0,
      horizonLift: 0,
      objectTopAngleDeg: 0,
      objectTopAngleFlatDeg: 0,
      objectNearTiltDeg: 0,
      lineOfSightClearing: 0,
      lineOfSightClearingRefracted: 0,
      leftRightWidth,
      leftRightWidthAngleDeg,
      leftRightDrop,
      leftRightDropAngleDeg,
      sceneWidth,
      sceneHeight,
    };
  }

  const realObjectVector = objectVector(inputs.objectSurfaceDistances[objIx], inputs.objectSidePositions[objIx], 0, refractedRadiusEarth, -refractedRadiusEarth);
  const objectSurfaceAngle = vectorAngle(realObjectVector, [0, 0, refractedRadiusEarth]);
  const objectRealSurfaceDistance = objectSurfaceAngle * refractedRadiusEarth;
  const objectNearSize = getObjectSizeVar(inputs, objIx) * inputs.objectSizes[objIx];
  const bulge = refractedRadiusEarth * (1 - Math.cos(objectRealSurfaceDistance / (2 * refractedRadiusEarth)));
  const objectDropFromObserverSurface = refractedRadiusEarth * (1 - Math.cos(objectRealSurfaceDistance / refractedRadiusEarth));
  const horizontalDistance = refractedRadiusEarth * Math.sin(objectRealSurfaceDistance / refractedRadiusEarth);
  const objectDropAngleDeg = toDeg(Math.atan(objectDropFromObserverSurface / horizontalDistance));
  const objectBaseRefracted = objectVector(inputs.objectSurfaceDistances[objIx], inputs.objectSidePositions[objIx], 0, refractedRadiusEarth, height);
  const objectTopRefracted = objectVector(inputs.objectSurfaceDistances[objIx], inputs.objectSidePositions[objIx], objectNearSize, refractedRadiusEarth, height);
  const objectBaseGeometric = objectVector(inputs.objectSurfaceDistances[objIx], inputs.objectSidePositions[objIx], 0, radiusEarth, height);
  const objectNearTiltDeg = toDeg(vectorAngle([0, 0, 1], sub(objectTopRefracted, objectBaseRefracted)));
  const objectSizeAngleDeg = Math.abs(toDeg(vectorAngle(objectBaseRefracted, objectTopRefracted))) < 1e-5 ? 0 : toDeg(vectorAngle(objectBaseRefracted, objectTopRefracted));
  let objectRefractionAngleDeg = Math.abs(toDeg(vectorAngle(objectBaseGeometric, objectBaseRefracted))) < 1e-5 ? 0 : toDeg(vectorAngle(objectBaseGeometric, objectBaseRefracted));
  if (refractionCoeff < 0) objectRefractionAngleDeg *= -1;

  const horizonRefrAngleDeg = toDeg(horizonRefrAngle);
  const objectLiftAbsolute = objectSizeAngleDeg === 0 ? 0 : (objectNearSize * objectRefractionAngleDeg) / objectSizeAngleDeg;
  const horizonLift = objectSizeAngleDeg === 0 ? 0 : (objectNearSize * horizonRefrAngleDeg) / objectSizeAngleDeg;
  const objectLiftRelativeToHorizon = objectLiftAbsolute - horizonLift;

  let objectHidden = 0;
  let objectVisible = objectNearSize;
  if (objectSurfaceAngle > horizonDropAngle) {
    const cosaHorObj = Math.cos(objectSurfaceAngle - horizonDropAngle);
    objectHidden = (refractedRadiusEarth * (1 - cosaHorObj)) / cosaHorObj;
    objectVisible = Math.max(0, objectNearSize - objectHidden);
  }
  const objectHiddenAngleDeg = objectNearSize === 0 ? 0 : (objectSizeAngleDeg * objectHidden) / objectNearSize;
  const objectVisibleAngleDeg = objectNearSize === 0 ? 0 : (objectSizeAngleDeg * objectVisible) / objectNearSize;

  const observerRadius = refractedRadiusEarth + height;
  const targetRadius = refractedRadiusEarth + objectNearSize;
  const c = Math.sqrt(observerRadius ** 2 + targetRadius ** 2 - 2 * observerRadius * targetRadius * Math.cos(objectRealSurfaceDistance / refractedRadiusEarth));
  const a1 = (c ** 2 - targetRadius ** 2 + observerRadius ** 2) / (2 * observerRadius);
  const objectTopAngleDeg = -toDeg(Math.asin(a1 / c));
  const objectTopAngleFlatDeg = toDeg(Math.atan((inputs.objectSizes[objIx] - height) / objectRealSurfaceDistance));

  const losObjectVector = objectVector(inputs.objectSurfaceDistances[objIx], inputs.objectSidePositions[objIx], 0, radiusEarth, -radiusEarth);
  const losObjectAngle = vectorAngle(losObjectVector, [0, 0, radiusEarth]);
  const d = losObjectAngle * radiusEarth;
  const clearingGeometric = lineOfSightClearing(radiusEarth, height, objectNearSize, d);
  const clearingRefracted = lineOfSightClearing(refractedRadiusEarth, height, objectNearSize, d);

  return {
    refractionCoeff,
    refractionFactor,
    refractedRadiusEarth,
    temperatureGradient,
    pressureMbar,
    temperatureC,
    viewAngle,
    focalLength,
    horizonDropAngleDeg: toDeg(horizonDropAngle),
    horizonRefrAngleDeg,
    horizonSurfaceDistance,
    horizonDistanceLineOfSight,
    horizonDistanceOnEyeLevel,
    horizonDropFromObserverSurface,
    horizonDropFromEyeLevel,
    gridSpacing,
    bulge,
    nearObjectIndex,
    objectVisible,
    objectHidden,
    objectVisibleAngleDeg,
    objectHiddenAngleDeg,
    objectDropFromObserverSurface,
    objectDropAngleDeg,
    objectSizeAngleDeg,
    objectRefractionAngleDeg,
    objectLiftAbsolute,
    objectLiftRelativeToHorizon,
    horizonLift,
    objectTopAngleDeg,
    objectTopAngleFlatDeg,
    objectNearTiltDeg,
    lineOfSightClearing: clearingGeometric,
    lineOfSightClearingRefracted: clearingRefracted,
    leftRightWidth,
    leftRightWidthAngleDeg,
    leftRightDrop,
    leftRightDropAngleDeg,
    sceneWidth,
    sceneHeight,
  };
}

function lineOfSightClearing(radius: number, observerHeight: number, objectHeight: number, distance: number): number {
  const a = radius + observerHeight;
  const b = radius + objectHeight;
  const w = distance / radius;
  const r = (a * b * Math.sin(w)) / Math.sqrt((a * Math.sin(w)) ** 2 + (b - a * Math.cos(w)) ** 2);
  return r - radius;
}

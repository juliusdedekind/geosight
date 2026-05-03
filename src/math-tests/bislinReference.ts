export const DIAGONAL_35MM_EQUIVALENT = 43.2666153;

export function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function refractedRadius(radius: number, refractionCoeff: number): number {
  return radius / (1 - refractionCoeff);
}

export function refractionCoeffFromAtmosphere(pressureMbar: number, temperatureC: number, temperatureGradient: number): number {
  const temperatureK = temperatureC + 273.15;
  return 503 * (pressureMbar / (temperatureK * temperatureK)) * (0.0343 + temperatureGradient);
}

export function temperatureGradientFromRefraction(refractionCoeff: number, pressureMbar: number, temperatureC: number): number {
  const temperatureK = temperatureC + 273.15;
  return (refractionCoeff * temperatureK * temperatureK) / (503 * pressureMbar) - 0.0343;
}

export function viewAngleDegFromFocalLength(focalLengthMm: number): number {
  return toDeg(2 * Math.atan(DIAGONAL_35MM_EQUIVALENT / (2 * focalLengthMm)));
}

export function focalLengthFromViewAngleDeg(viewAngleDeg: number): number {
  return DIAGONAL_35MM_EQUIVALENT / (2 * Math.tan(toRad(viewAngleDeg) / 2));
}

export function curvatureDrop(surfaceDistance: number, radius: number, refractionCoeff: number): number {
  const radiusRefracted = refractedRadius(radius, refractionCoeff);
  return radiusRefracted * (1 - Math.cos(surfaceDistance / radiusRefracted));
}

export function horizon(radius: number, observerHeight: number, refractionCoeff: number) {
  const radiusRefracted = refractedRadius(radius, refractionCoeff);
  const angle = Math.acos(radiusRefracted / (radiusRefracted + observerHeight));
  const distanceOnEyeLevel = radiusRefracted * Math.sin(angle);
  const surfaceDistance = radiusRefracted * angle;
  const dropFromObserverSurface = curvatureDrop(surfaceDistance, radius, refractionCoeff);

  return {
    angle,
    surfaceDistance,
    distanceLineOfSight: Math.sqrt((radiusRefracted + observerHeight) ** 2 - radiusRefracted ** 2),
    distanceOnEyeLevel,
    dropFromObserverSurface,
    dropFromEyeLevel: dropFromObserverSurface + observerHeight,
  };
}

export function horizonRefractionAngle(radius: number, observerHeight: number, refractionCoeff: number): number {
  return Math.acos(radius / (radius + observerHeight)) - horizon(radius, observerHeight, refractionCoeff).angle;
}

export function hiddenHeightFromSurfaceDistance(surfaceDistance: number, radius: number, observerHeight: number, refractionCoeff: number): number {
  const radiusRefracted = refractedRadius(radius, refractionCoeff);
  const horizonAngle = Math.acos(radiusRefracted / (radiusRefracted + observerHeight));
  const objectAngle = surfaceDistance / radiusRefracted;
  if (objectAngle <= horizonAngle) return 0;

  return radiusRefracted / Math.cos(objectAngle - horizonAngle) - radiusRefracted;
}

export function hiddenHeightFromLineOfSightDistance(lineOfSightDistance: number, radius: number, observerHeight: number, refractionCoeff: number): number {
  const radiusRefracted = refractedRadius(radius, refractionCoeff);
  const horizonLosDistance = Math.sqrt((radiusRefracted + observerHeight) ** 2 - radiusRefracted ** 2);
  return Math.sqrt((lineOfSightDistance - horizonLosDistance) ** 2 + radiusRefracted ** 2) - radiusRefracted;
}

export function targetTopAngle(surfaceDistance: number, radius: number, observerHeight: number, targetHeight: number, refractionCoeff: number): number {
  const radiusRefracted = refractedRadius(radius, refractionCoeff);
  const observerRadius = radiusRefracted + observerHeight;
  const targetRadius = radiusRefracted + targetHeight;
  const gamma = surfaceDistance / radiusRefracted;
  const lineOfSight = Math.sqrt(observerRadius ** 2 + targetRadius ** 2 - 2 * observerRadius * targetRadius * Math.cos(gamma));
  return -Math.asin((observerRadius - targetRadius * Math.cos(gamma)) / lineOfSight);
}

export function flatTargetTopAngle(surfaceDistance: number, observerHeight: number, targetHeight: number): number {
  return Math.atan((targetHeight - observerHeight) / surfaceDistance);
}

export function greatCircleSurfaceDistance(distanceForward: number, distanceSide: number, radius: number): number {
  const centralAngle = Math.acos(Math.cos(distanceSide / radius) * Math.cos(distanceForward / radius));
  return radius * centralAngle;
}

export function objectVector(distanceForward: number, distanceSide: number, targetHeight: number, radius: number, observerHeight: number): [number, number, number] {
  const objectRadius = radius + targetHeight;
  const sideAngle = distanceSide / radius;
  const forwardAngle = distanceForward / radius;
  const projectedRadius = objectRadius * Math.cos(sideAngle);

  return [
    objectRadius * Math.sin(sideAngle),
    projectedRadius * Math.sin(forwardAngle),
    projectedRadius * Math.cos(forwardAngle) - (radius + observerHeight),
  ];
}

export function vectorAngle(a: [number, number, number], b: [number, number, number]): number {
  const aLen = Math.hypot(...a);
  const bLen = Math.hypot(...b);
  const scalarProduct = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (aLen * bLen);
  return Math.acos(Math.max(-1, Math.min(1, scalarProduct)));
}

export function objectRefractionAngle(
  distanceForward: number,
  distanceSide: number,
  radius: number,
  observerHeight: number,
  refractionCoeff: number,
): number {
  const radiusRefracted = refractedRadius(radius, refractionCoeff);
  const geometric = objectVector(distanceForward, distanceSide, 0, radius, observerHeight);
  const refracted = objectVector(distanceForward, distanceSide, 0, radiusRefracted, observerHeight);
  const angle = vectorAngle(geometric, refracted);
  return refractionCoeff < 0 ? -angle : angle;
}

export function lineOfSightClearing(radius: number, observerHeight: number, targetHeight: number, surfaceDistance: number): number {
  const observerRadius = radius + observerHeight;
  const targetRadius = radius + targetHeight;
  const centralAngle = surfaceDistance / radius;
  const sinAngle = Math.sin(centralAngle);
  const cosAngle = Math.cos(centralAngle);
  const closestRadius =
    (observerRadius * targetRadius * sinAngle) /
    Math.sqrt((observerRadius * sinAngle) ** 2 + (targetRadius - observerRadius * cosAngle) ** 2);

  return closestRadius - radius;
}

export function leftRightHorizonDrop(
  horizonLineOfSight: number,
  horizonDistanceOnEyeLevel: number,
  horizonDropFromEyeLevel: number,
  horizonAngle: number,
  viewAngleDeg: number,
  deviceRatio: number,
) {
  const yFieldOfViewHalf = toRad(viewAngleDeg) / Math.sqrt(1 + 1 / (deviceRatio * deviceRatio)) / 2;
  const halfWidth = horizonLineOfSight * Math.sin(yFieldOfViewHalf);
  if (halfWidth >= horizonDistanceOnEyeLevel) {
    return {
      width: 0,
      widthAngleDeg: 0,
      drop: 0,
      dropAngleDeg: 0,
    };
  }

  const width = halfWidth * 2;
  const widthAngle = 2 * Math.asin(width / (2 * horizonLineOfSight));
  const leftRightDistance = Math.sqrt(horizonDistanceOnEyeLevel ** 2 - halfWidth ** 2);
  const verticalAngle = Math.atan(leftRightDistance / horizonDropFromEyeLevel);
  const dropAngle = Math.PI / 2 - horizonAngle - verticalAngle;

  return {
    width,
    widthAngleDeg: toDeg(widthAngle),
    drop: horizonLineOfSight * dropAngle,
    dropAngleDeg: toDeg(dropAngle),
  };
}

const heightLimitTab = [11000, 20000, 32000, 47000, 51000, 71000, 84852, 0];
const heightReferenceTab = [0, 11000, 20000, 32000, 47000, 51000, 71000, Number.NaN];
const gradientTab = [-0.0065, 0, 0.001, 0.0028, 0, -0.0028, -0.002, Number.NaN];
const temperatureReferenceTab = [288.15, 216.65, 216.65, 228.65, 270.65, 270.65, 214.65, Number.NaN];
const pressureReferenceTab = [101325, 22632.1, 5474.89, 868.019, 110.906, 66.9389, 3.95642, Number.NaN];
const standardGravity = 9.80665;
const specificGasConstant = 287.058;

export function standardAtmosphereReference(heightMeters: number) {
  const index = Math.max(
    0,
    heightLimitTab.findIndex((heightLimit) => heightMeters <= heightLimit),
  );
  const gradient = gradientTab[index];
  const heightReference = heightReferenceTab[index];
  const temperatureReference = temperatureReferenceTab[index];
  const pressureReference = pressureReferenceTab[index];
  const temperatureK = temperatureReference + gradient * (heightMeters - heightReference);
  const pressurePa =
    gradient === 0
      ? pressureReference * Math.exp(-(heightMeters - heightReference) / ((specificGasConstant * temperatureReference) / standardGravity))
      : pressureReference * Math.pow(1 + (gradient * (heightMeters - heightReference)) / temperatureReference, -standardGravity / specificGasConstant / gradient);

  return {
    temperatureK,
    temperatureC: temperatureK - 273.15,
    pressurePa,
    pressureMbar: pressurePa / 100,
    gradient,
  };
}

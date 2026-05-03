import { toRad } from "../core/math";
import type { CurveInputs, CurveOutputs } from "../core/curvatureModel";

export type Vec3 = [number, number, number];
export type Vec2 = [number, number];

export interface CameraParams {
  sceneSize: number;
  camPos: Vec3;
  camUp: Vec3;
  camViewCenter: Vec3;
}

export type CameraAim = "input" | "globeHorizon" | "flatHorizon" | "flatEquator" | "between" | "eyeLevel";

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function length(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

function norm(v: Vec3): Vec3 {
  const len = length(v);
  return len === 0 ? [0, 0, 0] : [v[0] / len, v[1] / len, v[2] / len];
}

export function computeCamera(inputs: CurveInputs, outputs: CurveOutputs, aim: CameraAim = "input"): CameraParams {
  const viewDistance = Math.hypot(outputs.horizonDistanceOnEyeLevel, outputs.horizonDropFromEyeLevel);
  let viewAngle = baseViewAngle(inputs, outputs, aim);
  viewAngle -= toRad(inputs.tilt);
  viewAngle = Math.max(-0.9999 * Math.PI / 2, Math.min(0.9999 * Math.PI / 2, viewAngle));

  const pan = toRad(inputs.pan);
  const z = -viewDistance * Math.sin(viewAngle);
  const r = viewDistance * Math.cos(viewAngle);
  const x = r * Math.sin(pan);
  const y = r * Math.cos(pan);
  const camViewCenter: Vec3 = [x, y, z];
  const viewCenterNorm = norm(camViewCenter);
  const horizontal = norm([x, y, 0]);
  const normal = cross(horizontal, [0, 0, 1]);
  const up = cross(normal, viewCenterNorm);

  const vpRatio = 3 / 2;
  const sceneSize = inputs.deviceRatio > vpRatio ? outputs.sceneWidth / vpRatio : outputs.sceneHeight;
  return {
    sceneSize: Math.max(1, sceneSize),
    camPos: [0, 0, 0],
    camUp: norm(up),
    camViewCenter,
  };
}

function baseViewAngle(inputs: CurveInputs, outputs: CurveOutputs, aim: CameraAim): number {
  const globeHorizonAngle = toRad(outputs.horizonDropAngleDeg);
  const flatEquatorAngle = Math.atan(Math.max(0.001, inputs.height) / Math.max(1, inputs.equatorRadiusFE));
  const flatHorizonAngle = Math.atan(Math.max(0.001, inputs.height) / Math.max(1, flatHorizonDistance(outputs)));

  if (aim === "globeHorizon") return globeHorizonAngle;
  if (aim === "flatHorizon") return flatHorizonAngle;
  if (aim === "flatEquator") return flatEquatorAngle;
  if (aim === "between") return (flatEquatorAngle + globeHorizonAngle) / 2;
  if (aim === "eyeLevel") return 0;

  if (inputs.viewcenterHorizon === 0) return globeHorizonAngle;
  if (inputs.viewcenterHorizon === 1) return flatEquatorAngle;
  if (inputs.viewcenterHorizon === 2) return (flatEquatorAngle + globeHorizonAngle) / 2;
  return 0;
}

export class JsgLikeCamera {
  private readonly xAxis: Vec3;
  private readonly yAxis: Vec3;
  private readonly zAxis: Vec3;
  private readonly screenDist: number;

  constructor(private readonly params: CameraParams) {
    const viewVector = sub(params.camViewCenter, params.camPos);
    const viewCenterDistance = Math.max(1e-9, length(viewVector));
    const viewDir = norm(viewVector);
    this.xAxis = scale(viewDir, -1);
    const camUp = norm(params.camUp);
    this.yAxis = norm(cross(camUp, this.xAxis));
    this.zAxis = norm(cross(this.xAxis, this.yAxis));
    this.screenDist = viewCenterDistance / Math.max(1e-9, params.sceneSize);
  }

  project(point: Vec3): Vec2 | null {
    const relative = sub(point, this.params.camPos);
    const cx = dot(this.xAxis, relative);
    const cy = dot(this.yAxis, relative);
    const cz = dot(this.zAxis, relative);
    const depth = -cx;
    if (depth <= 1e-6) return null;
    return [(cy * this.screenDist) / depth, (cz * this.screenDist) / depth];
  }
}

export function worldPointOnEarth(outputs: CurveOutputs, observerHeight: number, distance: number, side = 0, altitude = 0): Vec3 {
  const radius = outputs.refractedRadiusEarth + altitude;
  const sideAngle = side / outputs.refractedRadiusEarth;
  const distAngle = distance / outputs.refractedRadiusEarth;
  const rr = radius * Math.cos(sideAngle);
  return [
    radius * Math.sin(sideAngle),
    rr * Math.sin(distAngle),
    rr * Math.cos(distAngle) - (outputs.refractedRadiusEarth + observerHeight),
  ];
}

export function worldPointOnPlane(distance: number, side = 0, altitude = 0, observerHeight = 0): Vec3 {
  return [side, distance, altitude - observerHeight];
}

export function flatHorizonDistance(outputs: CurveOutputs): number {
  return outputs.horizonDistanceOnEyeLevel;
}

export function screenMapper(width: number, height: number, rect?: { x: number; y: number; width: number; height: number }) {
  const viewport = rect ?? { x: 0, y: 0, width, height };
  const scale = Math.min(viewport.width, viewport.height) * 0.82;
  return ([x, y]: Vec2): Vec2 => [viewport.x + viewport.width / 2 + x * scale, viewport.y + viewport.height / 2 - y * scale];
}

export function rotateZ(point: Vec3, angleRad: number): Vec3 {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return [point[0] * c - point[1] * s, point[0] * s + point[1] * c, point[2]];
}

export function translate(point: Vec3, offset: Vec3): Vec3 {
  return add(point, offset);
}

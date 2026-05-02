export const PI90 = Math.PI / 2;

export function toRad(valueDeg: number): number {
  return (valueDeg * Math.PI) / 180;
}

export function toDeg(valueRad: number): number {
  return (valueRad * 180) / Math.PI;
}

export type Vec3 = [number, number, number];

export function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function norm(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]);
  if (len === 0) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}

export function vectorAngle(a: Vec3, b: Vec3): number {
  const sp = Math.max(-1, Math.min(1, dot(norm(a), norm(b))));
  return Math.acos(sp);
}

export function objectVector(dist: number, side: number, size: number, radius: number, height: number): Vec3 {
  const objectRadius = radius + size;
  const sideAngle = side / radius;
  const distAngle = dist / radius;
  const projectedRadius = objectRadius * Math.cos(sideAngle);
  return [
    objectRadius * Math.sin(sideAngle),
    projectedRadius * Math.sin(distAngle),
    projectedRadius * Math.cos(distAngle) - (radius + height),
  ];
}

import { useEffect, useRef } from "react";
import { getObjectSizeVar, type CurveInputs, type CurveOutputs } from "../core/curvatureModel";
import { formatAngle, formatHeight, formatLength, formatNumber } from "../core/units";
import { useCurveStore } from "../state/curveStore";
import { computeCamera, flatHorizonDistance, JsgLikeCamera, screenMapper, worldPointOnEarth, worldPointOnPlane, type Vec2, type Vec3 } from "./jsgProjection";

export function CurvatureScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputs = useCurveStore((state) => state.inputs);
  const outputs = useCurveStore((state) => state.outputs);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resizeObserver = new ResizeObserver(() => drawScene(canvas, context, inputs, outputs));
    resizeObserver.observe(canvas);
    drawScene(canvas, context, inputs, outputs);

    return () => resizeObserver.disconnect();
  }, [inputs, outputs]);

  return (
    <div className="scene-wrap">
      <canvas ref={canvasRef} className="curve-canvas" />
      <div className="scene-annotations" aria-hidden="true">
        <SceneAnnotations inputs={inputs} outputs={outputs} />
      </div>
    </div>
  );
}

function SceneAnnotations({ inputs, outputs }: { inputs: CurveInputs; outputs: CurveOutputs }) {
  return (
    <>
      {inputs.showDataObject && (
        <div className="scene-note note-object">
          <p className="highlight">
            Target {outputs.nearObjectIndex + 1} Visible = {formatHeight(outputs.objectVisible, inputs.unitsType)}; Hidden ={" "}
            {formatHeight(outputs.objectHidden, inputs.unitsType)}
          </p>
          <p>
            Size = {formatHeight(inputs.objectSizes[outputs.nearObjectIndex], inputs.unitsType)}; Angular Size ={" "}
            {formatAngle(outputs.objectSizeAngleDeg, inputs.angleFormat)}
          </p>
          <p>
            Drop = {formatHeight(outputs.objectDropFromObserverSurface, inputs.unitsType)}; Drop Angle ={" "}
            {formatAngle(outputs.objectDropAngleDeg, inputs.angleFormat)}
          </p>
          <p>
            Top Angle = {formatAngle(outputs.objectTopAngleDeg, inputs.angleFormat)}; Tilt ={" "}
            {formatAngle(outputs.objectNearTiltDeg, inputs.angleFormat)}
          </p>
        </div>
      )}

      {inputs.showDataHorizon && (
        <div className="scene-note note-horizon">
          <p>Distance on Surface = {formatLength(outputs.horizonSurfaceDistance, inputs.unitsType)}</p>
          <p>Horizon Dip Angle = {formatAngle(outputs.horizonDropAngleDeg, inputs.angleFormat)}</p>
          <p>Horizon Refr Angle = {formatAngle(outputs.horizonRefrAngleDeg, inputs.angleFormat)}</p>
          <p>Drop from Eye-Level = {formatHeight(outputs.horizonDropFromEyeLevel, inputs.unitsType)}</p>
          <p>Drop from Surface = {formatHeight(outputs.horizonDropFromObserverSurface, inputs.unitsType)}</p>
          <p>Sagitta (Bulge) = {formatHeight(outputs.bulge, inputs.unitsType)}</p>
          <p>Grid Spacing = {formatLength(outputs.gridSpacing, inputs.unitsType)}</p>
        </div>
      )}

      {inputs.showLeftRightDrop && (
        <div className="scene-note note-left-right">
          <p>Left-Right Drop Angle = {formatAngle(outputs.leftRightDropAngleDeg, inputs.angleFormat)}</p>
          <p>Left-Right Width Angle = {formatAngle(outputs.leftRightWidthAngleDeg, inputs.angleFormat)}</p>
          <p>Left-Right Drop = {formatHeight(outputs.leftRightDrop, inputs.unitsType)}</p>
          <p>Left-Right Width = {formatLength(outputs.leftRightWidth, inputs.unitsType)}</p>
          <p>Apparent Radius = {formatLength(outputs.refractedRadiusEarth, inputs.unitsType)}</p>
        </div>
      )}

      {inputs.showDataRefraction && (
        <div className="scene-note note-refraction">
          <p className="highlight">Target Lift rel to Horizon = {formatHeight(outputs.objectLiftRelativeToHorizon, inputs.unitsType)}</p>
          <p>Target Lift Absolute = {formatHeight(outputs.objectLiftAbsolute, inputs.unitsType)}</p>
          <p>Horizon Lift = {formatHeight(outputs.horizonLift, inputs.unitsType)}</p>
          <p className="red">Target Refr Angle = {formatAngle(outputs.objectRefractionAngleDeg, inputs.angleFormat)}</p>
          <p className="red">Refraction Coeff k = {formatNumber(outputs.refractionCoeff, 4)}</p>
          <p className="red">Temp. Gradient dT/dh = {formatNumber(outputs.temperatureGradient, 5)} deg C/m</p>
        </div>
      )}
    </>
  );
}

function drawScene(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, inputs: CurveInputs, outputs: CurveOutputs) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#d7d7d7";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  if (inputs.showModel === 4) {
    drawModelPanel(ctx, inputs, outputs, { x: 0, y: 0, width: width / 2, height }, "flat");
    drawModelPanel(ctx, inputs, outputs, { x: width / 2, y: 0, width: width / 2, height }, "globe");
    ctx.save();
    ctx.strokeStyle = "#d7d7d7";
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.restore();
  } else {
    drawModelPanel(ctx, inputs, outputs, { x: 0, y: 0, width, height }, inputs.showModel === 2 ? "flat" : inputs.showModel === 3 ? "both" : "globe");
  }

  drawTheodolite(ctx, inputs, width, height);
}

type ModelKind = "globe" | "flat" | "both";
type ViewportRect = { x: number; y: number; width: number; height: number };

function drawModelPanel(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  viewport: ViewportRect,
  kind: ModelKind,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(viewport.x, viewport.y, viewport.width, viewport.height);
  ctx.clip();

  const camera = new JsgLikeCamera(computeCamera(inputs, outputs, kind === "flat" ? "flatHorizon" : "input"));
  const map = screenMapper(viewport.width, viewport.height, viewport);
  const project = (point: Vec3) => {
    const projected = camera.project(point);
    return projected ? map(projected) : null;
  };

  if (kind === "globe" || kind === "both") {
    drawProjectedGrid(ctx, inputs, outputs, project);
    drawProjectedGlobeHorizon(ctx, inputs, outputs, project, viewport);
  }

  if (kind === "flat" || kind === "both") {
    drawProjectedFlatGrid(ctx, inputs, outputs, project);
    drawProjectedFlatProjection(ctx, inputs, outputs, project);
  }

  drawProjectedEyeLevel(ctx, outputs, project, viewport);
  drawHorizonMarkers(ctx, viewport, projectedHorizonY(outputs, inputs.height, project, viewport.height, kind));
  drawProjectedTargets(ctx, inputs, outputs, project, viewport, kind === "flat" ? "flat" : "globe");

  if (viewport.x > 0 || kind !== "both") drawPanelLabel(ctx, viewport, kind === "flat" ? "Flat Earth" : kind === "globe" ? "Globe" : "");
  ctx.restore();
}

function drawProjectedGrid(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
) {
  ctx.save();
  ctx.strokeStyle = "rgba(86, 95, 255, 0.45)";
  ctx.lineWidth = 1;

  const distanceMax = Math.max(outputs.horizonSurfaceDistance * 1.35, ...inputs.objectSurfaceDistances) * 1.1;
  const sideMax = Math.max(outputs.horizonDistanceOnEyeLevel * 0.75, distanceMax * 0.35);
  const distanceStep = Math.max(outputs.gridSpacing, distanceMax / 18);
  const sideStep = sideMax / 8;

  for (let side = -sideMax; side <= sideMax + 1; side += sideStep) {
    const points: Vec2[] = [];
    for (let distance = 0; distance <= distanceMax; distance += distanceStep / 2) {
      const point = project(worldPointOnEarth(outputs, inputs.height, distance, side, 0));
      if (point) points.push(point);
    }
    drawPolyline(ctx, points);
  }

  for (let distance = distanceStep; distance <= distanceMax + 1; distance += distanceStep) {
    const points: Vec2[] = [];
    for (let side = -sideMax; side <= sideMax + 1; side += sideStep / 2) {
      const point = project(worldPointOnEarth(outputs, inputs.height, distance, side, 0));
      if (point) points.push(point);
    }
    drawPolyline(ctx, points);
  }

  ctx.restore();
}

function drawProjectedFlatProjection(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
) {
  ctx.save();
  ctx.strokeStyle = "rgba(220, 38, 38, 0.8)";
  ctx.lineWidth = 1.5;
  const horizonDistance = flatHorizonDistance(outputs);
  const sideMax = horizonDistance * 0.9;
  const points: Vec2[] = [];
  for (let side = -sideMax; side <= sideMax; side += sideMax / 64) {
    const point = project(worldPointOnPlane(horizonDistance, side, 0, inputs.height));
    if (point) points.push(point);
  }
  drawPolyline(ctx, points);
  ctx.restore();
}

function drawProjectedFlatGrid(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
) {
  ctx.save();
  ctx.strokeStyle = "rgba(86, 95, 255, 0.34)";
  ctx.lineWidth = 1;
  const distanceMax = Math.max(outputs.horizonSurfaceDistance * 1.35, ...inputs.objectSurfaceDistances) * 1.1;
  const sideMax = Math.max(outputs.horizonDistanceOnEyeLevel * 0.75, distanceMax * 0.35);
  const distanceStep = Math.max(outputs.gridSpacing, distanceMax / 18);
  const sideStep = sideMax / 8;
  for (let side = -sideMax; side <= sideMax + 1; side += sideStep) {
    const points: Vec2[] = [];
    for (let distance = 0; distance <= distanceMax; distance += distanceStep / 2) {
      const point = project(worldPointOnPlane(distance, side, 0, inputs.height));
      if (point) points.push(point);
    }
    drawPolyline(ctx, points);
  }
  for (let distance = distanceStep; distance <= distanceMax + 1; distance += distanceStep) {
    const points: Vec2[] = [];
    for (let side = -sideMax; side <= sideMax + 1; side += sideStep / 2) {
      const point = project(worldPointOnPlane(distance, side, 0, inputs.height));
      if (point) points.push(point);
    }
    drawPolyline(ctx, points);
  }
  ctx.restore();
}

function drawProjectedGlobeHorizon(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
  viewport: ViewportRect,
) {
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  const tangentY = projectedHorizonY(outputs, inputs.height, project, 0, "globe");
  ctx.beginPath();
  ctx.moveTo(viewport.x, tangentY);
  ctx.lineTo(viewport.x + viewport.width, tangentY);
  ctx.stroke();

  ctx.strokeStyle = "#0000ff";
  ctx.lineWidth = 2;
  const sideMax = outputs.horizonDistanceOnEyeLevel * 0.9;
  const points: Vec2[] = [];
  for (let side = -sideMax; side <= sideMax; side += sideMax / 96) {
    const point = project(worldPointOnEarth(outputs, inputs.height, outputs.horizonSurfaceDistance, side, 0));
    if (point) points.push(point);
  }
  drawPolyline(ctx, points);
  ctx.restore();
}

function drawProjectedEyeLevel(
  ctx: CanvasRenderingContext2D,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
  viewport: ViewportRect,
) {
  ctx.save();
  ctx.strokeStyle = "#ff00ff";
  ctx.lineWidth = 1.5;
  const left = project([-outputs.horizonDistanceOnEyeLevel, outputs.horizonDistanceOnEyeLevel, 0]);
  const right = project([outputs.horizonDistanceOnEyeLevel, outputs.horizonDistanceOnEyeLevel, 0]);
  const eyeY = left && right ? (left[1] + right[1]) / 2 : 0;
  ctx.beginPath();
  ctx.moveTo(viewport.x, eyeY);
  ctx.lineTo(viewport.x + viewport.width, eyeY);
  ctx.stroke();
  ctx.fillStyle = "#ff00ff";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Eye-Level", viewport.x + viewport.width / 2, eyeY - 8);
  ctx.restore();
}

function drawHorizonMarkers(ctx: CanvasRenderingContext2D, viewport: ViewportRect, horizonY: number) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  drawTriangle(ctx, viewport.x + 30, horizonY + 36, 18, 20);
  drawTriangle(ctx, viewport.x + viewport.width - 30, horizonY + 36, 18, 20);
  ctx.restore();
}

function drawProjectedTargets(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
  viewport: ViewportRect,
  kind: "globe" | "flat",
) {
  ([0, 1] as const).forEach((targetIndex) => {
    const count = Math.max(0, Math.min(500, Math.round(inputs.objectCounts[targetIndex])));
    if (count === 0) return;
    const skip = Math.max(1, Math.ceil(count / 80));
    for (let n = count - 1; n >= 0; n -= skip) {
      const distance = inputs.objectSurfaceDistances[targetIndex] + n * inputs.objectDeltaDistances[targetIndex];
      const side = sideOffset(inputs, targetIndex, n, count);
      const objectSize = inputs.objectSizes[targetIndex];
      const targetHeight = getObjectSizeVar(inputs, targetIndex) * inputs.objectSizes[targetIndex];
      const base =
        kind === "flat" ? project(worldPointOnPlane(distance, side, 0, inputs.height)) : project(worldPointOnEarth(outputs, inputs.height, distance, side, 0));
      const top =
        kind === "flat"
          ? project(worldPointOnPlane(distance, side, targetHeight, inputs.height))
          : project(worldPointOnEarth(outputs, inputs.height, distance, side, targetHeight));
      if (!base || !top) continue;
      if (base[0] < viewport.x - 20 || base[0] > viewport.x + viewport.width + 20 || base[1] < viewport.y - 80 || base[1] > viewport.y + viewport.height + 100) continue;
      if (inputs.targetTypes[targetIndex] === 1) {
        const projectedSize = Math.hypot(top[0] - base[0], top[1] - base[1]);
        const size = Math.max(8, projectedSize);
        drawMountain(ctx, base[0], base[1], size, targetIndex);
      } else {
        const hidden = hiddenAtDistance(distance, outputs, targetHeight);
        drawProjectedRod(ctx, inputs, outputs, project, kind, distance, side, objectSize, targetHeight, hidden);
      }
    }
  });
}

function drawProjectedRod(
  ctx: CanvasRenderingContext2D,
  inputs: CurveInputs,
  outputs: CurveOutputs,
  project: (point: Vec3) => Vec2 | null,
  kind: "globe" | "flat",
  distance: number,
  side: number,
  objectSize: number,
  targetHeight: number,
  hidden: number,
) {
  const sizeVar = targetHeight / Math.max(0.001, objectSize);
  const point = (xUnits: number, zUnits: number) => {
    const lateral = side + xUnits * objectSize;
    const altitude = zUnits * objectSize;
    return kind === "flat"
      ? project(worldPointOnPlane(distance, lateral, altitude, inputs.height))
      : project(worldPointOnEarth(outputs, inputs.height, distance, lateral, altitude));
  };

  ctx.save();
  fillProjectedRect(ctx, point, -0.1, 0, 0.1, sizeVar, "#facc15");

  ctx.fillStyle = "#ef4444";
  for (let z = 0.5; z < sizeVar; z += 1) {
    fillProjectedRect(ctx, point, -0.1, z, 0, Math.min(z + 0.5, sizeVar), "#ef4444");
  }
  for (let z = 0.1; z < sizeVar; z += 0.2) {
    fillProjectedRect(ctx, point, 0, z, 0.1, Math.min(z + 0.1, sizeVar), "#ef4444");
  }

  if (hidden > 0) {
    fillProjectedRect(ctx, point, -0.11, 0, 0.11, Math.min(sizeVar, hidden / Math.max(0.001, objectSize)), "rgba(249, 115, 22, 0.88)");
  }

  strokeProjectedRect(ctx, point, -0.1, 0, 0.1, sizeVar, "#111827");
  ctx.restore();
}

function fillProjectedRect(
  ctx: CanvasRenderingContext2D,
  point: (xUnits: number, zUnits: number) => Vec2 | null,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  fillStyle: string,
) {
  const p1 = point(x1, z1);
  const p2 = point(x2, z1);
  const p3 = point(x2, z2);
  const p4 = point(x1, z2);
  if (!p1 || !p2 || !p3 || !p4) return;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p4[0], p4[1]);
  ctx.closePath();
  ctx.fill();
}

function strokeProjectedRect(
  ctx: CanvasRenderingContext2D,
  point: (xUnits: number, zUnits: number) => Vec2 | null,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  strokeStyle: string,
) {
  const p1 = point(x1, z1);
  const p2 = point(x2, z1);
  const p3 = point(x2, z2);
  const p4 = point(x1, z2);
  if (!p1 || !p2 || !p3 || !p4) return;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p4[0], p4[1]);
  ctx.closePath();
  ctx.stroke();
}

function drawMountain(ctx: CanvasRenderingContext2D, x: number, groundY: number, size: number, targetIndex: number) {
  ctx.save();
  ctx.fillStyle = targetIndex === 0 ? "#92aace" : "#abacb1";
  ctx.strokeStyle = "#53657c";
  ctx.beginPath();
  ctx.moveTo(x - size * 0.45, groundY);
  ctx.lineTo(x - size * 0.24, groundY - size * 0.45);
  ctx.lineTo(x - size * 0.1, groundY - size * 0.4);
  ctx.lineTo(x + size * 0.05, groundY - size);
  ctx.lineTo(x + size * 0.22, groundY - size * 0.56);
  ctx.lineTo(x + size * 0.45, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTheodolite(ctx: CanvasRenderingContext2D, inputs: CurveInputs, width: number, height: number) {
  if (!inputs.showTheodolite) return;
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 60, height / 2);
  ctx.lineTo(width / 2 - 10, height / 2);
  ctx.moveTo(width / 2 + 10, height / 2);
  ctx.lineTo(width / 2 + 60, height / 2);
  ctx.moveTo(width / 2, height / 2 - 60);
  ctx.lineTo(width / 2, height / 2 - 10);
  ctx.moveTo(width / 2, height / 2 + 10);
  ctx.lineTo(width / 2, height / 2 + 60);
  ctx.stroke();
  ctx.restore();
}

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x - w / 2, y);
  ctx.lineTo(x + w / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function hiddenAtDistance(dist: number, outputs: CurveOutputs, targetHeight: number) {
  const angle = Math.abs(dist) / outputs.refractedRadiusEarth;
  const horizonAngle = (outputs.horizonDropAngleDeg * Math.PI) / 180;
  if (angle <= horizonAngle) return 0;
  const cosa = Math.cos(angle - horizonAngle);
  const hidden = (outputs.refractedRadiusEarth * (1 - cosa)) / cosa;
  return Math.min(targetHeight, Math.max(0, hidden));
}

function drawPolyline(ctx: CanvasRenderingContext2D, points: Vec2[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();
}

function projectedHorizonY(outputs: CurveOutputs, observerHeight: number, project: (point: Vec3) => Vec2 | null, fallbackHeight: number, kind: ModelKind) {
  const point =
    kind === "flat"
      ? worldPointOnPlane(flatHorizonDistance(outputs), 0, 0, observerHeight)
      : worldPointOnEarth(outputs, observerHeight, outputs.horizonSurfaceDistance, 0, 0);
  const p = project(point);
  return p ? p[1] : fallbackHeight * 0.58;
}

function sideOffset(inputs: CurveInputs, targetIndex: 0 | 1, drawnIndex: number, count: number) {
  const base = inputs.objectSidePositions[targetIndex];
  let variation = inputs.objectSideVariations[targetIndex] / 2;
  const normalized = count <= 1 ? 0 : (count - 1 - drawnIndex) / (count - 1);
  const type = inputs.objectSideTypes[targetIndex];
  if (type === 0) variation *= 2 * normalized - 1;
  if (type === 1) variation *= drawnIndex % 2 === 0 ? -1 : 1;
  if (type === 2) variation *= ((186573.6498496 * Math.sqrt(drawnIndex)) % 2) - 1;
  if (type === 3) variation *= Math.cos(2 * Math.PI * normalized);
  if (type === 4) variation *= Math.sin(2 * Math.PI * normalized);
  return base + variation;
}

function drawPanelLabel(ctx: CanvasRenderingContext2D, viewport: ViewportRect, label: string) {
  if (!label) return;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.fillRect(viewport.x + 8, viewport.y + 8, 86, 26);
  ctx.fillStyle = "#111827";
  ctx.font = "700 14px Arial";
  ctx.textAlign = "left";
  ctx.fillText(label, viewport.x + 16, viewport.y + 26);
  ctx.restore();
}

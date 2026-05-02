import { formatAngle, formatBigLength, formatHeight, formatLength, formatNumber } from "../core/units";
import { useCurveStore } from "../state/curveStore";

export function DataPanels() {
  const inputs = useCurveStore((state) => state.inputs);
  const outputs = useCurveStore((state) => state.outputs);

  return (
    <>
      <section className="panel data-panel">
        <h2>Nearest Target Data</h2>
        <DataRow label="Nearest target" value={`Target ${outputs.nearObjectIndex + 1}`} />
        <DataRow label="Visible" value={formatHeight(outputs.objectVisible, inputs.unitsType)} />
        <DataRow label="Hidden" value={formatHeight(outputs.objectHidden, inputs.unitsType)} />
        <DataRow label="Visible angle" value={formatAngle(outputs.objectVisibleAngleDeg, inputs.angleFormat)} />
        <DataRow label="Hidden angle" value={formatAngle(outputs.objectHiddenAngleDeg, inputs.angleFormat)} />
        <DataRow label="Drop" value={formatHeight(outputs.objectDropFromObserverSurface, inputs.unitsType)} />
        <DataRow label="Drop angle" value={formatAngle(outputs.objectDropAngleDeg, inputs.angleFormat)} />
        <DataRow label="Angular size" value={formatAngle(outputs.objectSizeAngleDeg, inputs.angleFormat)} />
        <DataRow label="Refraction angle" value={formatAngle(outputs.objectRefractionAngleDeg, inputs.angleFormat)} />
        <DataRow label="Lift absolute" value={formatHeight(outputs.objectLiftAbsolute, inputs.unitsType)} />
        <DataRow label="Relative to horizon" value={formatHeight(outputs.objectLiftRelativeToHorizon, inputs.unitsType)} />
        <DataRow label="Top angle" value={formatAngle(outputs.objectTopAngleDeg, inputs.angleFormat)} />
        <DataRow label="Top angle FE" value={formatAngle(outputs.objectTopAngleFlatDeg, inputs.angleFormat)} />
        <DataRow label="Tilt" value={formatAngle(outputs.objectNearTiltDeg, inputs.angleFormat)} />
        <DataRow label="Sagitta (bulge)" value={formatHeight(outputs.bulge, inputs.unitsType)} />
        <DataRow label="LoS clearing" value={formatHeight(outputs.lineOfSightClearing, inputs.unitsType)} />
        <DataRow label="Refr. LoS clearing" value={formatHeight(outputs.lineOfSightClearingRefracted, inputs.unitsType)} />
      </section>

      <section className="panel data-panel">
        <h2>Horizon Data</h2>
        <DataRow label="Dip angle" value={formatAngle(outputs.horizonDropAngleDeg, inputs.angleFormat)} />
        <DataRow label="Refraction angle" value={formatAngle(outputs.horizonRefrAngleDeg, inputs.angleFormat)} />
        <DataRow label="Dist on surface" value={formatLength(outputs.horizonSurfaceDistance, inputs.unitsType)} />
        <DataRow label="Grid spacing" value={formatLength(outputs.gridSpacing, inputs.unitsType)} />
        <DataRow label="Dist from eye" value={formatLength(outputs.horizonDistanceLineOfSight, inputs.unitsType)} />
        <DataRow label="Dist on eye-level" value={formatLength(outputs.horizonDistanceOnEyeLevel, inputs.unitsType)} />
        <DataRow label="Drop" value={formatHeight(outputs.horizonDropFromObserverSurface, inputs.unitsType)} />
        <DataRow label="Drop from eye-level" value={formatHeight(outputs.horizonDropFromEyeLevel, inputs.unitsType)} />
        <DataRow label="Left-right width" value={formatLength(outputs.leftRightWidth, inputs.unitsType)} />
        <DataRow label="Frame width" value={formatLength(outputs.sceneWidth, inputs.unitsType)} />
        <DataRow label="Left-right drop" value={formatHeight(outputs.leftRightDrop, inputs.unitsType)} />
        <DataRow label="Left-right drop angle" value={formatAngle(outputs.leftRightDropAngleDeg, inputs.angleFormat)} />
        <DataRow label="Radius Earth" value={formatBigLength(inputs.radiusEarth, inputs.unitsType)} />
        <DataRow label="Apparent radius" value={formatLength(outputs.refractedRadiusEarth, inputs.unitsType)} />
      </section>

      <section className="panel data-panel">
        <h2>Refraction Data</h2>
        <DataRow label="Coeff. k" value={formatNumber(outputs.refractionCoeff, 6)} />
        <DataRow label="Factor a" value={formatNumber(outputs.refractionFactor, 6)} />
        <DataRow label="Temperature" value={`${formatNumber(outputs.temperatureC, 4)} deg C`} />
        <DataRow label="Pressure" value={`${formatNumber(outputs.pressureMbar, 4)} mbar`} />
        <DataRow label="dT/dh" value={`${formatNumber(outputs.temperatureGradient, 6)} deg C/m`} />
      </section>
    </>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="data-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

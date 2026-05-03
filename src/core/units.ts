export type UnitsType = 0 | 1 | 2;
export type AngleFormat = 0 | 1 | 2;
export type NumberFormat = 0 | 1 | 2 | 3;

const numberFormatLocales = ["en-US", "de-DE", "de-CH", "en-001"] as const;

export const lengthUnits = {
  units: ["m", "mi", "ft"],
  mults: [1, 1609.344, 0.3048],
} as const;

export const bigLengthUnits = {
  units: ["km", "mi", "ft"],
  mults: [1000, 1609.344, 0.3048],
} as const;

export const heightUnits = {
  units: ["m", "ft", "ft"],
  mults: [1, 0.3048, 0.3048],
} as const;

export const gradientUnits = {
  units: ["deg C/m", "deg C/ft", "deg C/ft"],
  mults: [1, 1 / 0.3048, 1 / 0.3048],
} as const;

export function formatNumber(value: number, digits = 4, numberFormat: NumberFormat = 0): string {
  if (!Number.isFinite(value)) return "n/a";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 100000 || abs < 0.001)) {
    return value.toExponential(Math.min(digits, 6));
  }
  return new Intl.NumberFormat(numberFormatLocales[numberFormat], {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatLength(valueMeters: number, unitsType: UnitsType, digits = 4, numberFormat: NumberFormat = 0): string {
  return `${formatNumber(valueMeters / lengthUnits.mults[unitsType], digits, numberFormat)} ${lengthUnits.units[unitsType]}`;
}

export function formatBigLength(valueMeters: number, unitsType: UnitsType, digits = 4, numberFormat: NumberFormat = 0): string {
  return `${formatNumber(valueMeters / bigLengthUnits.mults[unitsType], digits, numberFormat)} ${bigLengthUnits.units[unitsType]}`;
}

export function formatHeight(valueMeters: number, unitsType: UnitsType, digits = 4, numberFormat: NumberFormat = 0): string {
  return `${formatNumber(valueMeters / heightUnits.mults[unitsType], digits, numberFormat)} ${heightUnits.units[unitsType]}`;
}

export function formatAngle(valueDeg: number, format: AngleFormat, digits = 6, numberFormat: NumberFormat = 0): string {
  if (!Number.isFinite(valueDeg)) return "n/a";
  if (format === 0) return `${formatNumber(valueDeg, digits, numberFormat)} deg`;

  const sign = valueDeg < 0 ? "-" : "";
  const abs = Math.abs(valueDeg);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  if (format === 1) return `${sign}${degrees} deg ${formatNumber(minutesFloat, 4, numberFormat)}'`;
  return `${sign}${degrees} deg ${minutes}' ${formatNumber(seconds, 3, numberFormat)}"`;
}

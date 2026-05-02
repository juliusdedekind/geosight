const hLimitTab = [11000, 20000, 32000, 47000, 51000, 71000, 84852, 0];
const hRefTab = [0, 11000, 20000, 32000, 47000, 51000, 71000, Number.NaN];
const alphaTab = [-0.0065, 0, 0.001, 0.0028, 0, -0.0028, -0.002, Number.NaN];
const tRefTab = [288.15, 216.65, 216.65, 228.65, 270.65, 270.65, 214.65, Number.NaN];
const pRefTab = [101325, 22632.1, 5474.89, 868.019, 110.906, 66.9389, 3.95642, Number.NaN];

const g = 9.80665;
const rs = 287.058;

function rangeIndex(height: number): number {
  const ix = hLimitTab.findIndex((limit) => height <= limit);
  return ix === -1 ? hLimitTab.length - 1 : ix;
}

export interface AtmosphereAtHeight {
  temperatureC: number;
  temperatureK: number;
  pressurePa: number;
  pressureMbar: number;
  gradient: number;
}

export function standardAtmosphere(heightMeters: number): AtmosphereAtHeight {
  const ix = rangeIndex(heightMeters);
  const alpha = alphaTab[ix];
  const hRef = hRefTab[ix];
  const tRef = tRefTab[ix];
  const pRef = pRefTab[ix];
  const temperatureK = tRef + alpha * (heightMeters - hRef);
  const pressurePa =
    alpha === 0
      ? pRef * Math.exp(-(heightMeters - hRef) / ((rs * tRef) / g))
      : pRef * Math.pow(1 + (alpha * (heightMeters - hRef)) / tRef, -g / rs / alpha);

  return {
    temperatureC: temperatureK - 273.15,
    temperatureK,
    pressurePa,
    pressureMbar: pressurePa / 100,
    gradient: alpha,
  };
}

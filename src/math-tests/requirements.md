# GeoSight math requirements

Reference source: Walter Bislin, "Advanced Earth Curvature Calculator",
https://www.bislins.ch/walti/bloge/index.asp?page=Advanced+Earth+Curvature+Calculator

Supporting implementation reference: Walter Bislin, "Source Code: Advanced Earth
Curvature Calculator",
https://www.bislins.ch/walti/bloge/index.asp?page=Source+Code%3A+Advanced+Earth+Curvature+Calculator

Accessed: 2026-05-03.

This document records the formula requirements used by the GeoSight math tests.
It intentionally omits the interactive UI and paraphrases the source prose. Test
quantities are SI unless noted: meters for length, radians internally, degrees
only for user-facing angle outputs.

## Shared definitions

- `R`: geometric earth radius.
- `k`: refraction coefficient.
- `a`: refraction factor, `a = 1 / (1 - k)`.
- `Rr`: refracted earth radius, `Rr = R / (1 - k) = a * R`.
- `hO`: observer eye height above the surface.
- `s`: distance from observer to target along the surface.
- `d`: line-of-sight distance where explicitly named.
- `T`: target top height above the target base.

GeoSight must use exact equations for production outputs. Approximation formulas
are retained here only as reference checks and explanatory background.

## Camera field of view

For a 35 mm equivalent diagonal:

```text
diag35 = sqrt(36^2 + 24^2) mm = 43.2666153 mm
f = diag35 / (2 * tan(theta / 2))
theta = 2 * atan(diag35 / (2 * f))
```

`theta` is the diagonal field of view. GeoSight stores the displayed value in
degrees, then converts to radians for trigonometry.

## Curvature drop

Exact drop from the tangent plane at the observer surface:

```text
x = Rr * (1 - cos(s / Rr))
```

Small-distance approximation:

```text
x ~= s^2 / (2 * Rr), for s << Rr
```

## Hidden target height

Exact hidden height from a line-of-sight tangent distance:

```text
hH = sqrt((d - sqrt((Rr + hO)^2 - Rr^2))^2 + Rr^2) - Rr
```

Exact hidden height from a surface distance:

```text
hH = Rr / cos(s / Rr - acos(Rr / (Rr + hO))) - Rr
```

The hidden-height equations apply after the target lies beyond the horizon. In
front of the horizon, hidden height is zero. Visible target height is
`max(0, T - hH)`.

Small-observer-height approximation:

```text
hH ~= (d - sqrt(2 * Rr * hO))^2 / (2 * Rr), for hO << Rr
```

## Horizon distance

Exact line-of-sight distance to the horizon:

```text
dH = sqrt((Rr + hO)^2 - Rr^2)
```

Exact surface distance to the horizon:

```text
sH = Rr * acos(Rr / (Rr + hO))
```

Equivalent horizon angle and related app outputs:

```text
thetaH = acos(Rr / (Rr + hO))
horizonDistanceOnEyeLevel = Rr * sin(thetaH)
horizonDropFromObserverSurface = Rr * (1 - cos(thetaH))
horizonDropFromEyeLevel = horizonDropFromObserverSurface + hO
horizonRefractionAngle = acos(R / (R + hO)) - thetaH
```

Small-height approximation:

```text
dH ~= sqrt(2 * Rr * hO)
```

## Target top angle

Vertical angle from observer eye level to the target top:

```text
alpha = -asin((A - B * cos(gamma)) / sqrt(A^2 + B^2 - 2 * A * B * cos(gamma)))
A = Rr + hO
B = Rr + T
gamma = s / Rr
```

GeoSight reports `alpha` in degrees. The flat-earth comparison angle is:

```text
alphaFE = atan((T - hO) / s)
```

## Side-offset surface distance

When a target has a lateral side position, GeoSight uses the great-circle angle
implied by Bislin's object-vector equations:

```text
sigma = acos(cos(side / Rr) * cos(distance / Rr))
sReal = Rr * sigma
```

`sReal` is then used by the curvature drop, hidden height, and top-angle
equations.

## Refraction and standard atmosphere

When deriving `k` from pressure, temperature, and vertical temperature gradient:

```text
temperatureK = temperatureC + 273.15
k = 503 * pressureMbar / temperatureK^2 * (0.0343 + temperatureGradient)
temperatureGradient = k * temperatureK^2 / (503 * pressureMbar) - 0.0343
```

For standard-atmosphere synchronization, use the altitude layer constants from
Bislin's source code:

```text
temperatureK = TRef + alpha * (h - hRef)

if alpha == 0:
  pressurePa = pRef * exp(-(h - hRef) / (RS * TRef / g))
else:
  pressurePa = pRef * (1 + alpha * (h - hRef) / TRef)^(-g / (RS * alpha))
```

with `g = 9.80665` and `RS = 287.058`.

## Line-of-sight clearing

For a sight line from observer height `hO` to target height `T` over surface
angle `w = s / Rr`, the closest clearance above the earth surface is:

```text
A = Rr + hO
B = Rr + T
r = A * B * sin(w) / sqrt((A * sin(w))^2 + (B - A * cos(w))^2)
clearing = r - Rr
```

GeoSight computes both geometric clearing with `R` and refracted clearing with
`Rr`.

## Left-right horizon drop

For a view with diagonal field of view `theta` and device ratio `q`:

```text
yFovHalf = theta / sqrt(1 + 1 / q^2) / 2
halfWidth = dH * sin(yFovHalf)
leftRightWidth = 2 * halfWidth
leftRightWidthAngle = 2 * asin(leftRightWidth / (2 * dH))
leftRightDistance = sqrt(horizonDistanceOnEyeLevel^2 - halfWidth^2)
verticalAngle = atan(leftRightDistance / horizonDropFromEyeLevel)
leftRightDropAngle = pi / 2 - thetaH - verticalAngle
leftRightDrop = dH * leftRightDropAngle
```

If `halfWidth >= horizonDistanceOnEyeLevel`, the whole-earth view case is
outside this calculation and GeoSight reports zero for the left-right outputs.

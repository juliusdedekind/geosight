import { useEffect, useRef } from "react";
import type {
  CurveInputs,
  CurveOutputs,
  ObjectType,
  RefractionSync,
  ShowModel,
  VariationType,
} from "../core/curvatureModel";
import { gradientUnits, heightUnits, lengthUnits, type AngleFormat, type NumberFormat, type UnitsType } from "../core/units";
import { useCurveStore } from "../state/curveStore";

const diagonal35mmEquivalent = 43.2666153;

type ControlPanelRuntime = {
  NewPanel: (params: Record<string, unknown>) => CpPanel;
  NewSliderPanel: (params: Record<string, unknown>) => CpPanel;
  Invalidate: (panelRefs?: unknown, updateGui?: boolean) => void;
  Update: (panelRefs?: unknown) => void;
  UpdateLayout: (panelRefs?: unknown) => void;
};

type CpPanel = {
  AddHeader: (params: Record<string, unknown>) => CpPanel;
  AddTextField: (params: Record<string, unknown>) => CpPanel;
  AddHtmlField: (params: Record<string, unknown>) => CpPanel;
  AddCheckboxField: (params: Record<string, unknown>) => CpPanel;
  AddRadiobuttonField: (params: Record<string, unknown>) => CpPanel;
  AddValueSliderField: (params: Record<string, unknown>) => CpPanel;
  GetHtml: () => string;
  Init: (forceGetDefault?: boolean) => void;
  Update: () => void;
  UpdateLayout: () => void;
  Delete: (deleteDom?: boolean) => void;
};

type CpField = {
  GetValueRef?: () => string;
};

interface GeoSightCpModel {
  Height: number;
  HeightSlider: number;
  FocalLengthField: number;
  FocalLength: number;
  FocalLengthSlider: number;
  ViewAngle: number;
  ViewAngleField: number;
  ViewAngleSlider: number;
  ShowModel: ShowModel;
  DeviceRatio: number;
  ViewcenterHorizon: 0 | 1 | 2 | 3;
  ObjType: [ObjectType, ObjectType];
  NObjects: [number, number];
  ObjSurfDist: [number, number];
  ObjDeltaDist: [number, number];
  ObjSideType: [VariationType, VariationType];
  ObjSidePos: [number, number];
  ObjSideVar: [number, number];
  ObjSizeType: [VariationType, VariationType];
  ObjSize: [number, number];
  ObjSizeVar: [number, number];
  SliderObjSurfDistLog: [number, number];
  SliderObjDeltaDistLog: [number, number];
  SliderObjSidePosLog: [number, number];
  SliderObjSideVarLog: [number, number];
  SliderObjSizeLog: [number, number];
  RefractionCoeff: number;
  RefractionSlider: number;
  TemperatureGradient: number;
  RefractionSync: RefractionSync;
  Pressure_mbar: number;
  Temperature_C: number;
  RefractionFactMin: number;
  RefractionFactMax: number;
  RadiusEarth: number;
  EquatorRadiusFE: number;
  ShowTheodolite: boolean;
  ShowDataObject: boolean;
  ShowDataRefraction: boolean;
  ShowDataHorizon: boolean;
  ShowLeftRightDrop: boolean;
  UnitsType: UnitsType;
  AngleFormat: AngleFormat;
  NumberFormat: NumberFormat;
  Tilt: number;
  TiltSlider: number;
  Pan: number;
  PanSlider: number;
  LengthMult: number;
  LengthUnit: string;
  HeightMult: number;
  HeightUnit: string;
  GradientMult: number;
  GradientUnit: string;
}

type GeoSightCpPairKey = {
  [Key in keyof GeoSightCpModel]: GeoSightCpModel[Key] extends [number, number] ? Key : never;
}[keyof GeoSightCpModel];

declare global {
  interface Window {
    ControlPanels?: ControlPanelRuntime;
    NumFormatter?: {
      SetLang: (lang: string) => void;
    };
    CurveApp?: GeoSightCpModel;
    GeoSightReset?: () => void;
    GeoSightStdRefraction?: () => void;
    GeoSightZeroRefraction?: () => void;
  }
}

export function ControlPanelControls() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<CpPanel[]>([]);
  const syncingRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    const controlPanels = window.ControlPanels;
    if (!host || !controlPanels) {
      if (host) {
        host.innerHTML = '<section class="panel"><h2>Controls unavailable</h2><p>ControlPanel runtime did not load.</p></section>';
      }
      return;
    }

    const initialState = useCurveStore.getState();
    const model = createCpModel(initialState.inputs, initialState.outputs);
    window.CurveApp = model;

    window.GeoSightReset = () => useCurveStore.getState().reset();
    window.GeoSightStdRefraction = () => useCurveStore.getState().updateInput("refractionSync", 2);
    window.GeoSightZeroRefraction = () =>
      useCurveStore.getState().updateInputs({ refractionSync: 0, refractionCoeff: 0 });

    const onModelChange = (field?: CpField) => {
      if (syncingRef.current) return;
      const valueRef = field?.GetValueRef?.() ?? "";
      applySliderChange(model, valueRef);
      const patch = cpModelToInputs(model, valueRef);
      useCurveStore.getState().updateInputs(patch);
    };

    const panels = createPanels(controlPanels, onModelChange);
    panelsRef.current = panels;
    host.innerHTML = panels.map((panel) => panel.GetHtml()).join("");

    syncingRef.current = true;
    try {
      panels.forEach((panel) => {
        panel.Init(true);
        panel.Update();
        panel.UpdateLayout();
      });
    } finally {
      syncingRef.current = false;
    }

    const unsubscribe = useCurveStore.subscribe((state) => {
      syncingRef.current = true;
      try {
        syncCpModel(model, state.inputs, state.outputs);
        controlPanels.Invalidate(panels);
        controlPanels.Update(panels);
        controlPanels.UpdateLayout(panels);
      } finally {
        syncingRef.current = false;
      }
    });

    return () => {
      unsubscribe();
      panelsRef.current.forEach((panel) => panel.Delete(false));
      panelsRef.current = [];
      host.innerHTML = "";
      delete window.CurveApp;
      delete window.GeoSightReset;
      delete window.GeoSightStdRefraction;
      delete window.GeoSightZeroRefraction;
    };
  }, []);

  return <div className="cp-controls" ref={hostRef} />;
}

function createPanels(controlPanels: ControlPanelRuntime, onModelChange: (field?: CpField) => void): CpPanel[] {
  return [
    createBasicsPanel(controlPanels, onModelChange),
    createOptionsPanel(controlPanels, onModelChange),
    createViewPanel(controlPanels, onModelChange),
    createTargetPanel(controlPanels, onModelChange, 0),
    createTargetPanel(controlPanels, onModelChange, 1),
    createRefractionPanel(controlPanels, onModelChange),
    createUnitsPanel(controlPanels, onModelChange),
  ];
}

function panelDefaults(onModelChange: (field?: CpField) => void, extra: Record<string, unknown> = {}) {
  return {
    ModelRef: "CurveApp",
    OnModelChange: onModelChange,
    AutoInit: false,
    Format: "std",
    Digits: 6,
    HelpImage: "",
    ...extra,
  };
}

function createBasicsPanel(controlPanels: ControlPanelRuntime, onModelChange: (field?: CpField) => void): CpPanel {
  return controlPanels
    .NewSliderPanel(panelDefaults(onModelChange, { Name: "BasicsPanel", PanelFormat: "InputMediumWidth" }))
    .AddHeader({
      Text:
        'Basics <a href="javascript:GeoSightStdRefraction()"><span class="lbtn lbtnBlack lbtnSmall">Std Refraction</span></a> ' +
        '<a href="javascript:GeoSightZeroRefraction()"><span class="lbtn lbtnBlack lbtnSmall">Zero Refraction</span></a> ' +
        '<a href="javascript:GeoSightReset()"><span class="lbtn lbtnBlack lbtnSmall">Reset</span></a>',
      ColSpan: 4,
    })
    .AddValueSliderField({
      Name: "Height",
      Label: "Observer Height",
      ValueRef: "Height",
      SliderValueRef: "HeightSlider",
      MultRef: "HeightMult",
      UnitsRef: "HeightUnit",
      Color: "blue",
      Min: 0,
      Max: 1,
      Inc: 0.1,
    })
    .AddValueSliderField({
      Name: "ObjSurfDist",
      Label: "Target Distance",
      ValueRef: "ObjSurfDist[0]",
      SliderValueRef: "SliderObjSurfDistLog[0]",
      MultRef: "LengthMult",
      UnitsRef: "LengthUnit",
      Color: "orange",
      Min: 0,
      Max: 5,
      Inc: 100,
    })
    .AddValueSliderField({
      Name: "TargetSize",
      Label: "Target Size",
      ValueRef: "ObjSize[0]",
      SliderValueRef: "SliderObjSizeLog[0]",
      MultRef: "HeightMult",
      UnitsRef: "HeightUnit",
      Color: "green",
      Min: 0,
      Max: 4,
      Inc: 1,
    })
    .AddValueSliderField({
      Name: "Refraction",
      Label: "Refraction k",
      ValueRef: "RefractionCoeff",
      SliderValueRef: "RefractionSlider",
      Color: "red",
      Min: -1,
      Max: 1,
      Inc: 0.01,
    })
    .AddValueSliderField({
      Name: "FocalLength",
      ValueRef: "FocalLengthField",
      SliderValueRef: "FocalLengthSlider",
      Label: "Zoom f",
      Units: "mm",
      Color: "black",
      Min: 0,
      Max: 1,
      Inc: 1,
    })
    .AddValueSliderField({
      Name: "ViewAngle",
      Label: "Diagonal&nbsp;FOV",
      ValueRef: "ViewAngleField",
      SliderValueRef: "ViewAngleSlider",
      Units: "deg",
      Color: "black",
      Min: 0.247517,
      Max: 91.6,
      Inc: 0.1,
    });
}

function createOptionsPanel(controlPanels: ControlPanelRuntime, onModelChange: (field?: CpField) => void): CpPanel {
  return controlPanels
    .NewPanel(panelDefaults(onModelChange, { Name: "OptionsPanel", NCols: 2, PanelFormat: "WideFieldGrid" }))
    .AddHeader({ Text: "Options", ColSpan: 4 })
    .AddRadiobuttonField({
      Name: "ShowModel",
      Label: "Model",
      ValueType: "int",
      Items: [
        { Name: "Globe", Value: 1 },
        { Name: "FE", Value: 2, Text: "Flat Earth" },
        { Name: "GlobeFE", Value: 3, Text: "Globe+FE" },
        { Name: "SideBySide", Value: 4, Text: "Side by side" },
      ],
    })
    .AddRadiobuttonField({
      Name: "ViewcenterHorizon",
      Label: "Camera Aim",
      ValueType: "int",
      Items: [
        { Name: "Horizon", Value: 0 },
        { Name: "EyeLevel", Value: 3, Text: "Eye-Level" },
      ],
    })
    .AddCheckboxField({
      Name: "ShowData",
      Label: "Show Data",
      ColSpan: 3,
      Items: [
        { Name: "ShowDataObject", Text: "Object" },
        { Name: "ShowDataRefraction", Text: "Refr." },
        { Name: "ShowDataHorizon", Text: "Horizon" },
        { Name: "ShowLeftRightDrop", Text: "Left-Right Drop" },
        { Name: "ShowTheodolite", Text: "Theodolite" },
      ],
    });
}

function createViewPanel(controlPanels: ControlPanelRuntime, onModelChange: (field?: CpField) => void): CpPanel {
  return controlPanels
    .NewSliderPanel(panelDefaults(onModelChange, { Name: "ViewPanel", PanelFormat: "InputMediumWidth" }))
    .AddHeader({ Text: "View", ColSpan: 4 })
    .AddValueSliderField({
      Name: "Pan",
      ValueRef: "Pan",
      SliderValueRef: "PanSlider",
      Digits: 5,
      Units: "deg",
      Color: "green",
      Min: -1,
      Max: 1,
      Inc: 0.1,
    })
    .AddValueSliderField({
      Name: "Tilt",
      ValueRef: "Tilt",
      SliderValueRef: "TiltSlider",
      Digits: 5,
      Units: "deg",
      Color: "green",
      Min: -1,
      Max: 1,
      Inc: 0.1,
    })
    .AddTextField({
      Name: "DeviceRatio",
      Label: "Device ratio",
      ValueRef: "DeviceRatio",
      Format: "std",
      Digits: 4,
    });
}

function createTargetPanel(
  controlPanels: ControlPanelRuntime,
  onModelChange: (field?: CpField) => void,
  index: 0 | 1,
): CpPanel {
  const targetNumber = index + 1;
  return controlPanels
    .NewSliderPanel(
      panelDefaults(onModelChange, {
        Name: `ObjectPanel${index}`,
        PanelFormat: "InputMediumWidth",
      }),
    )
    .AddHeader({ Text: `Target ${targetNumber}`, ColSpan: 4 })
    .AddValueSliderField({
      Name: `NObjects${index}`,
      Label: "Objects",
      ValueRef: `NObjects[${index}]`,
      Format: "fix",
      Digits: 0,
      Color: "black",
      Min: 0,
      Max: 500,
      Inc: 1,
    })
    .AddValueSliderField({
      Name: `ObjSurfDist${index}`,
      Label: "Distance",
      ValueRef: `ObjSurfDist[${index}]`,
      SliderValueRef: `SliderObjSurfDistLog[${index}]`,
      MultRef: "LengthMult",
      UnitsRef: "LengthUnit",
      Color: "orange",
      Min: 0,
      Max: 5,
      Inc: 100,
    })
    .AddValueSliderField({
      Name: `ObjSize${index}`,
      Label: "Size",
      ValueRef: `ObjSize[${index}]`,
      SliderValueRef: `SliderObjSizeLog[${index}]`,
      MultRef: "HeightMult",
      UnitsRef: "HeightUnit",
      Color: "green",
      Min: 0,
      Max: 4,
      Inc: 1,
    })
    .AddValueSliderField({
      Name: `ObjDeltaDist${index}`,
      Label: "Delta distance",
      ValueRef: `ObjDeltaDist[${index}]`,
      SliderValueRef: `SliderObjDeltaDistLog[${index}]`,
      MultRef: "LengthMult",
      UnitsRef: "LengthUnit",
      Color: "orange",
      Min: -3,
      Max: 5,
      Inc: 10,
    })
    .AddValueSliderField({
      Name: `ObjSidePos${index}`,
      Label: "Side position",
      ValueRef: `ObjSidePos[${index}]`,
      SliderValueRef: `SliderObjSidePosLog[${index}]`,
      MultRef: "LengthMult",
      UnitsRef: "LengthUnit",
      Color: "blue",
      Min: -5,
      Max: 5,
      Inc: 10,
    })
    .AddValueSliderField({
      Name: `ObjSideVar${index}`,
      Label: "Side variation",
      ValueRef: `ObjSideVar[${index}]`,
      SliderValueRef: `SliderObjSideVarLog[${index}]`,
      MultRef: "LengthMult",
      UnitsRef: "LengthUnit",
      Color: "blue",
      Min: -5,
      Max: 5,
      Inc: 10,
    })
    .AddTextField({
      Name: `ObjSizeVar${index}`,
      Label: "Size variation",
      ValueRef: `ObjSizeVar[${index}]`,
      Format: "std",
      Digits: 4,
    })
    .AddRadiobuttonField({
      Name: `ObjType${index}`,
      Label: "Type",
      ValueRef: `ObjType[${index}]`,
      ValueType: "int",
      Items: [
        { Name: `MRod${index}`, Value: 0, Text: "M-Rod" },
        { Name: `Mountain${index}`, Value: 1, Text: "Mountain" },
      ],
    })
    .AddRadiobuttonField({
      Name: `ObjSideType${index}`,
      Label: "Side var. mode",
      ValueRef: `ObjSideType[${index}]`,
      ValueType: "int",
      Items: variationItems(`Side${index}`),
    })
    .AddRadiobuttonField({
      Name: `ObjSizeType${index}`,
      Label: "Size var. mode",
      ValueRef: `ObjSizeType[${index}]`,
      ValueType: "int",
      Items: variationItems(`Size${index}`),
    });
}

function createRefractionPanel(controlPanels: ControlPanelRuntime, onModelChange: (field?: CpField) => void): CpPanel {
  return controlPanels
    .NewPanel(panelDefaults(onModelChange, { Name: "RefractionPanel", NCols: 2, PanelFormat: "InputMediumWidth" }))
    .AddHeader({ Text: "Refraction", ColSpan: 4 })
    .AddRadiobuttonField({
      Name: "RefractionSync",
      Label: "BaroLink",
      ValueType: "int",
      NCols: 4,
      Items: [
        { Name: "off", Value: 0 },
        { Name: "TP", Value: 1, Text: "T,P" },
        { Name: "StdAtm", Value: 2, Text: "Std-Atm" },
        { Name: "k013", Value: 3, Text: "k=0.13" },
        { Name: "k017", Value: 4, Text: "k=0.17" },
        { Name: "a76", Value: 5, Text: "a=7/6" },
        { Name: "a72", Value: 6, Text: "a=7/2" },
      ],
    })
    .AddTextField({ Name: "RefractionCoeff", Label: "Coeff. k", ValueRef: "RefractionCoeff", Digits: 6 })
    .AddTextField({
      Name: "TemperatureGradient",
      Label: "dT/dh",
      ValueRef: "TemperatureGradient",
      MultRef: "GradientMult",
      UnitsRef: "GradientUnit",
      Digits: 8,
    })
    .AddTextField({ Name: "Temperature_C", Label: "Temperature", ValueRef: "Temperature_C", Units: "deg C" })
    .AddTextField({ Name: "Pressure_mbar", Label: "Pressure", ValueRef: "Pressure_mbar", Units: "mbar" });
}

function createUnitsPanel(controlPanels: ControlPanelRuntime, onModelChange: (field?: CpField) => void): CpPanel {
  return controlPanels
    .NewPanel(panelDefaults(onModelChange, { Name: "UnitsPanel", NCols: 2, PanelFormat: "WideFieldGrid" }))
    .AddHeader({ Text: "Units", ColSpan: 4 })
    .AddRadiobuttonField({
      Name: "UnitsType",
      Label: "Units",
      ValueType: "int",
      Items: [
        { Name: "Metric", Value: 0, Text: "m / km" },
        { Name: "MiFt", Value: 1, Text: "mi / ft" },
        { Name: "FtFt", Value: 2, Text: "ft / ft" },
      ],
    })
    .AddRadiobuttonField({
      Name: "AngleFormat",
      Label: "AngleFormat",
      ValueType: "int",
      Items: [
        { Name: "deg", Value: 0, Text: "deg." },
        { Name: "DM", Value: 1 },
        { Name: "DMS", Value: 2 },
      ],
    })
    .AddRadiobuttonField({
      Name: "NumberFormat",
      Label: "Number Format",
      ValueType: "int",
      Items: [
        { Name: "English", Value: 0, Text: "1,234.56" },
        { Name: "German", Value: 1, Text: "1.234,56" },
        { Name: "Swiss", Value: 2, Text: "1'234,56" },
        { Name: "ISO", Value: 3, Text: "1 234,56" },
      ],
    });
}

function variationItems(prefix: string) {
  return [
    { Name: `${prefix}Lin`, Value: 0, Text: "Lin" },
    { Name: `${prefix}Alt`, Value: 1, Text: "2-Col / Alt" },
    { Name: `${prefix}Rand`, Value: 2, Text: "Rand" },
    { Name: `${prefix}Cos`, Value: 3, Text: "Cos" },
    { Name: `${prefix}Sin`, Value: 4, Text: "Sin" },
  ];
}

function createCpModel(inputs: CurveInputs, outputs: CurveOutputs): GeoSightCpModel {
  const model = {} as GeoSightCpModel;
  syncCpModel(model, inputs, outputs);
  return model;
}

function syncCpModel(model: GeoSightCpModel, inputs: CurveInputs, outputs: CurveOutputs): void {
  model.Height = inputs.height;
  model.HeightSlider = heightToSlider(inputs.height);
  model.FocalLengthField = inputs.focalLengthField;
  model.FocalLength = outputs.focalLength;
  model.FocalLengthSlider = focalLengthToSlider(inputs.focalLengthField);
  model.ViewAngle = outputs.viewAngle;
  model.ViewAngleField = outputs.viewAngle;
  model.ViewAngleSlider = outputs.viewAngle;
  model.ShowModel = inputs.showModel;
  model.DeviceRatio = inputs.deviceRatio;
  model.ViewcenterHorizon = inputs.viewcenterHorizon;
  syncPair(model, "ObjType", inputs.targetTypes);
  syncPair(model, "NObjects", inputs.objectCounts);
  syncPair(model, "ObjSurfDist", inputs.objectSurfaceDistances);
  syncPair(model, "ObjDeltaDist", inputs.objectDeltaDistances);
  syncPair(model, "ObjSideType", inputs.objectSideTypes);
  syncPair(model, "ObjSidePos", inputs.objectSidePositions);
  syncPair(model, "ObjSideVar", inputs.objectSideVariations);
  syncPair(model, "ObjSizeType", inputs.objectSizeTypes);
  syncPair(model, "ObjSize", inputs.objectSizes);
  syncPair(model, "ObjSizeVar", inputs.objectSizeVariations);
  syncPair(model, "SliderObjSurfDistLog", pairMap(inputs.objectSurfaceDistances, signedDistanceToSlider));
  syncPair(model, "SliderObjDeltaDistLog", pairMap(inputs.objectDeltaDistances, deltaDistanceToSlider));
  syncPair(model, "SliderObjSidePosLog", pairMap(inputs.objectSidePositions, signedDistanceToSlider));
  syncPair(model, "SliderObjSideVarLog", pairMap(inputs.objectSideVariations, sideVariationToSlider));
  syncPair(model, "SliderObjSizeLog", pairMap(inputs.objectSizes, objectSizeToSlider));
  model.RefractionCoeff = inputs.refractionCoeff;
  model.RefractionSlider = inputs.refractionCoeff;
  model.TemperatureGradient = inputs.temperatureGradient;
  model.RefractionSync = inputs.refractionSync;
  model.Pressure_mbar = inputs.pressureMbar;
  model.Temperature_C = inputs.temperatureC;
  model.RefractionFactMin = inputs.refractionFactMin;
  model.RefractionFactMax = inputs.refractionFactMax;
  model.RadiusEarth = inputs.radiusEarth;
  model.EquatorRadiusFE = inputs.equatorRadiusFE;
  model.ShowTheodolite = inputs.showTheodolite;
  model.ShowDataObject = inputs.showDataObject;
  model.ShowDataRefraction = inputs.showDataRefraction;
  model.ShowDataHorizon = inputs.showDataHorizon;
  model.ShowLeftRightDrop = inputs.showLeftRightDrop;
  model.UnitsType = inputs.unitsType;
  model.AngleFormat = inputs.angleFormat;
  model.NumberFormat = inputs.numberFormat;
  setCpNumberFormat(inputs.numberFormat);
  model.Tilt = inputs.tilt;
  model.TiltSlider = tiltToSlider(inputs.tilt);
  model.Pan = inputs.pan;
  model.PanSlider = panToSlider(inputs.pan);
  model.LengthMult = lengthUnits.mults[inputs.unitsType];
  model.LengthUnit = lengthUnits.units[inputs.unitsType];
  model.HeightMult = heightUnits.mults[inputs.unitsType];
  model.HeightUnit = heightUnits.units[inputs.unitsType];
  model.GradientMult = gradientUnits.mults[inputs.unitsType];
  model.GradientUnit = gradientUnits.units[inputs.unitsType];
}

function cpModelToInputs(model: GeoSightCpModel, valueRef: string): Partial<CurveInputs> {
  const focalLengthField =
    valueRef === "ViewAngleField" || valueRef === "ViewAngleSlider"
      ? viewAngleToFocalLength(model.ViewAngleField)
      : model.FocalLengthField;

  return {
    height: model.Height,
    focalLengthField,
    showModel: model.ShowModel,
    deviceRatio: model.DeviceRatio,
    viewcenterHorizon: model.ViewcenterHorizon,
    targetTypes: [...model.ObjType],
    objectCounts: [...model.NObjects],
    objectSurfaceDistances: [...model.ObjSurfDist],
    objectDeltaDistances: [...model.ObjDeltaDist],
    objectSideTypes: [...model.ObjSideType],
    objectSidePositions: [...model.ObjSidePos],
    objectSideVariations: [...model.ObjSideVar],
    objectSizeTypes: [...model.ObjSizeType],
    objectSizes: [...model.ObjSize],
    objectSizeVariations: [...model.ObjSizeVar],
    refractionCoeff: model.RefractionCoeff,
    temperatureGradient: model.TemperatureGradient,
    refractionSync: model.RefractionSync,
    pressureMbar: model.Pressure_mbar,
    temperatureC: model.Temperature_C,
    refractionFactMin: model.RefractionFactMin,
    refractionFactMax: model.RefractionFactMax,
    radiusEarth: model.RadiusEarth,
    equatorRadiusFE: model.EquatorRadiusFE,
    showTheodolite: model.ShowTheodolite,
    showDataObject: model.ShowDataObject,
    showDataRefraction: model.ShowDataRefraction,
    showDataHorizon: model.ShowDataHorizon,
    showLeftRightDrop: model.ShowLeftRightDrop,
    unitsType: model.UnitsType,
    angleFormat: model.AngleFormat,
    numberFormat: model.NumberFormat,
    tilt: model.Tilt,
    pan: model.Pan,
  };
}

function applySliderChange(model: GeoSightCpModel, valueRef: string): void {
  if (valueRef === "HeightSlider") {
    model.Height = Math.pow(10, -1 + 6 * model.HeightSlider);
  } else if (valueRef === "FocalLengthSlider") {
    model.FocalLengthField = sliderToFocalLength(model.FocalLengthSlider);
  } else if (valueRef === "ViewAngleSlider") {
    model.ViewAngleField = model.ViewAngleSlider;
  } else if (valueRef === "TiltSlider") {
    model.Tilt = sliderToTilt(model.TiltSlider);
  } else if (valueRef === "PanSlider") {
    model.Pan = sliderToPan(model.PanSlider);
  } else if (valueRef === "RefractionSlider") {
    model.RefractionCoeff = model.RefractionSlider;
  }

  applyIndexedSlider(valueRef, "SliderObjSurfDistLog", model.SliderObjSurfDistLog, model.ObjSurfDist, signedSliderToDistance);
  applyIndexedSlider(valueRef, "SliderObjDeltaDistLog", model.SliderObjDeltaDistLog, model.ObjDeltaDist, sliderToDeltaDistance);
  applyIndexedSlider(valueRef, "SliderObjSidePosLog", model.SliderObjSidePosLog, model.ObjSidePos, signedSliderToDistance);
  applyIndexedSlider(valueRef, "SliderObjSideVarLog", model.SliderObjSideVarLog, model.ObjSideVar, sliderToSideVariation);
  applyIndexedSlider(valueRef, "SliderObjSizeLog", model.SliderObjSizeLog, model.ObjSize, sliderToObjectSize);
}

function applyIndexedSlider(
  valueRef: string,
  name: string,
  sliders: [number, number],
  values: [number, number],
  convert: (value: number) => number,
): void {
  const match = valueRef.match(new RegExp(`^${name}\\[(0|1)\\]$`));
  if (!match) return;
  const index = Number(match[1]) as 0 | 1;
  values[index] = convert(sliders[index]);
}

function heightToSlider(height: number): number {
  return clamp((Math.log10(Math.max(0.001, height)) + 1) / 6, 0, 1);
}

function focalLengthToSlider(focalLength: number): number {
  return clamp(Math.sqrt(Math.max(0, focalLength - 21) / (10000 - 21)), 0, 1);
}

function sliderToFocalLength(slider: number): number {
  return (10000 - 21) * slider * slider + 21;
}

function viewAngleToFocalLength(viewAngleDeg: number): number {
  const viewAngle = clamp(viewAngleDeg, 0.1, 160);
  return diagonal35mmEquivalent / (2 * Math.tan((viewAngle * Math.PI) / 360));
}

function tiltToSlider(tilt: number): number {
  const clamped = clamp(tilt, -85, 45);
  return clamped >= 0 ? Math.sqrt(clamped / 45) : -Math.sqrt(-clamped / 85);
}

function sliderToTilt(slider: number): number {
  return slider >= 0 ? slider * slider * 45 : -slider * slider * 85;
}

function panToSlider(pan: number): number {
  const clamped = clamp(pan, -180, 180);
  return clamped >= 0 ? Math.sqrt(clamped / 90) : -Math.sqrt(-clamped / 90);
}

function sliderToPan(slider: number): number {
  return slider >= 0 ? slider * slider * 90 : -slider * slider * 90;
}

function signedDistanceToSlider(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const slider = abs < 100 ? abs / 100 : Math.log10(abs / 10);
  return sign * slider;
}

function signedSliderToDistance(slider: number): number {
  const sign = slider < 0 ? -1 : 1;
  const abs = Math.abs(slider);
  const value = abs < 1 ? 100 * abs : 10 * Math.pow(10, abs);
  return sign * value;
}

function sideVariationToSlider(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const slider = abs < 10 ? abs / 10 : Math.log10(abs);
  return sign * slider;
}

function sliderToSideVariation(slider: number): number {
  const sign = slider < 0 ? -1 : 1;
  const abs = Math.abs(slider);
  const value = abs < 1 ? 10 * abs : Math.pow(10, abs);
  return sign * value;
}

function objectSizeToSlider(value: number): number {
  return Math.log10(Math.max(0.001, value));
}

function sliderToObjectSize(slider: number): number {
  return Math.pow(10, slider);
}

function deltaDistanceToSlider(value: number): number {
  return Math.log10(Math.max(0.001, value) / 10);
}

function sliderToDeltaDistance(slider: number): number {
  return 10 * Math.pow(10, slider);
}

function pairMap<T>(value: readonly [number, number], callback: (item: number) => T): [T, T] {
  return [callback(value[0]), callback(value[1])];
}

function setCpNumberFormat(numberFormat: NumberFormat): void {
  const cpLangs = ["en", "de", "ch", "iso"] as const;
  window.NumFormatter?.SetLang(cpLangs[numberFormat]);
}

function syncPair(
  model: GeoSightCpModel,
  key: GeoSightCpPairKey,
  value: readonly [number, number],
): void {
  const pairModel = model as unknown as Record<GeoSightCpPairKey, [number, number] | undefined>;
  const current = pairModel[key];
  if (Array.isArray(current)) {
    current[0] = value[0];
    current[1] = value[1];
  } else {
    pairModel[key] = [value[0], value[1]];
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

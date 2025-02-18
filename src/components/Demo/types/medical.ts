export interface MassReport {
  definition: "Well-defined" | "Ill-defined" | "Spiculated";
  density: "Low Dense" | "Iso-dense" | "High Dense";
  shape: "Oval" | "Round" | "Irregular";
}

export interface AxillaReport {
  findings: boolean;
}

export interface CalcificationReport {
  type: "Discrete" | "Cluster/Grouped" | "Line/Segmental";
}

export interface BreastTissueReport {
  density: "Fatty/Normal" | "Fibroglandular" | "Heterogeneously Dense" | "Highly Dense";
}
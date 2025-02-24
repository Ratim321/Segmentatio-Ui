export interface MassReport {
  confidence: number;
  definition: "Well-defined" | "Ill-defined" | "Spiculated";
  density: "Low Dense" | "Iso-dense" | "High Dense";
  shape: "Oval" | "Round" | "Irregular";
  mass_calcification: string;
  measurements: string;
}

export interface AxilliaReport {
  confidence: number;
  findings: boolean;
}

export interface CalcificationReport {
  confidence: number;
  type: "Discrete" | "Cluster/Grouped" | "Line/Segmental";
}

export interface BreastTissueReport {
  confidence: number;
  density: "Fatty/Normal" | "Fibroglandular" | "Heterogeneously Dense" | "Highly Dense";
}

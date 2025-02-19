export interface MassData {
  type: "mass";
  found: 0 | 1;
  definition?: "Well-defined" | "Ill-defined" | "Spiculated";
  density?: "Low Dense" | "Iso-dense/ Equal Dense" | "High Dense";
  shape?: "Oval" | "Round" | "Irregular";
}

export interface AxilliaData {
  type: "axillia";
  found: 0 | 1;
}

export interface CalcificationData {
  type: "calcification";
  found: 0 | 1;
  calcification_type?: "Discrete" | "Cluster/Grouped" | "Line/Segmental";
}

export interface BreastTissueData {
  type: "breast tissue";
  found: 0 | 1;
  breast_density?: 
    | "fatty/normal" 
    | "fibroglandular/mixed fatty and fibroglandular" 
    | "heterogeneously dense" 
    | "highly dense";
}

export type RegionData = MassData | AxilliaData | CalcificationData | BreastTissueData;

export interface ImageReport {
  id: number;
  img: string;
  report: RegionData[];
}
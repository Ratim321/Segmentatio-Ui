export interface MassData {
  type: "mass";
  found: 0 | 1;
  confidence: number; // Add confidence percentage
  definition?: "Well-defined" | "Ill-defined" | "Spiculated";
  density?: "Low Dense" | "Iso-dense/ Equal Dense" | "High Dense";
  shape?: "Oval" | "Rounded" | "Irregular";
  measurement?: string;
  mass_calcification: string;
}

export interface AxilliaData {
  type: "axillia";
  found: 0 | 1;
  confidence: number; 
  axilla_type: string

export interface CalcificationData {
  type: "calcification";
  found: 0 | 1;
  confidence: number; // Add confidence percentage
  calcification_type?: "Discrete" | "Cluster/Grouped" | "Line/Segmental";
}

export interface BreastTissueData {
  type: "breast tissue";
  found: 0 | 1;
  confidence: number; // Add confidence percentage
  breast_density?: 
    | "fatty/normal" 
    | "fibroglandular/mixed fatty and fibroglandular" 
    | "heterogeneously dense" 
    | "highly dense";
}

export type RegionData = MassData | AxilliaData | CalcificationData | BreastTissueData ;

export interface ImageReport {
  id: number;
  input_img: string;
  output_img: string;
  report: RegionData[];
  BIRADS: number;
  comment: string[];
  
}
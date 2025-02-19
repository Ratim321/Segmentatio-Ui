export interface Point {
  x: number;
  y: number;
}

export interface Reference {
  title: string;
  source: string;
}

export interface Polygon {
  id: string;
  points: Point[];
  color: string;
  name: string;
  details?: string;
  confidence?: number;
  references?: Reference[];
}

export interface CaseStudy {
  id: number;
  image: string;
  diagnosis: string;
  similarity: number;
  metrics: {
    volume: number;
    density: number;
    growth: number;
    infiltration: number;
  };
  segmentation: Polygon[];
}

export interface SampleImage {
  id: number;
  thumbnail: string;
  result: string;
  type: string;
  description: string;
}

export interface ColorScheme {
  fill: string;
  stroke: string;
  bg: string;
  name: string;
}

export interface Finding {
  id: string;
  title: string;
  options: string[];
  selected?: string;
}

export interface Report {
  massPresence: string;
  massDefinition?: string;
  massDensity?: string;
  massShape?: string;
  axillaFindings: string;
  calcificationPresence: string;
  calcificationType?: string;
  breastDensity: string;
  biradsCategory: string;
}

export interface Region {
  id: string;
  coords: string;
  findings: {
    mass?: boolean;
    calcification?: boolean;
    axilla?: boolean;
    tissue?: boolean;
  };
  details: {
    title: string;
    description: string;
    report?: Partial<Report>;
  };
}

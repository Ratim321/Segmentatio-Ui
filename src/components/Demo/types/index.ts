export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  id: string;
  points: Point[];
  color: string;
  name: string;
  details?: string;
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
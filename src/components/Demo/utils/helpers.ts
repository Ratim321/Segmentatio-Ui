import { Point, Polygon } from '../types';

export const COLORS = [
  { fill: "fill-blue-500/20", stroke: "stroke-blue-600", bg: "bg-blue-500", name: "Region" },
  { fill: "fill-red-500/20", stroke: "stroke-red-600", bg: "bg-red-500", name: "Critical" },
  { fill: "fill-green-500/20", stroke: "stroke-green-600", bg: "bg-green-500", name: "Safe" },
  { fill: "fill-purple-500/20", stroke: "stroke-purple-600", bg: "bg-purple-500", name: "Target" },
  { fill: "fill-orange-500/20", stroke: "stroke-orange-600", bg: "bg-orange-500", name: "Review" },
];

export function randomPoint(maxWidth: number, maxHeight: number): Point {
  return {
    x: Math.floor(Math.random() * maxWidth),
    y: Math.floor(Math.random() * maxHeight),
  };
}

export function generateRandomPolygons(): Polygon[] {
  const polygonCount = Math.floor(Math.random() * 3) + 1;
  const randomDetails = [
    "Suspicious region with high infiltration",
    "Potential lesion - requires further review",
    "Inflammatory area with mild enhancement",
    "Benign region - no further action needed",
    "Irregular shape - recommended follow-up"
  ];

  const newPolygons: Polygon[] = [];

  for (let i = 0; i < polygonCount; i++) {
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    const pointCount = Math.floor(Math.random() * 3) + 5;
    const points: Point[] = [];
    
    for (let j = 0; j < pointCount; j++) {
      points.push(randomPoint(400, 300));
    }

    const detailIndex = Math.floor(Math.random() * randomDetails.length);

    newPolygons.push({
      id: Date.now().toString() + "-" + i,
      points,
      color: colorIndex.toString(),
      name: `${COLORS[colorIndex].name} Mask ${i + 1}`,
      details: randomDetails[detailIndex],
    });
  }

  return newPolygons;
}
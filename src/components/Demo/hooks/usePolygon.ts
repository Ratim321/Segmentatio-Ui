import { useState } from 'react';
import { Point, Polygon } from '../types';
import { COLORS } from '../utils/helpers';

export function usePolygon() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [activePolygon, setActivePolygon] = useState<string | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<Point[]>([]);
  const [editingPolygon, setEditingPolygon] = useState<string | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

  const deletePolygon = (id: string) => {
    setPolygons((prev) => prev.filter((poly) => poly.id !== id));
    setEditingPolygon(null);
  };

  const updatePolygon = (id: string, updates: Partial<Polygon>) => {
    setPolygons((prev) => 
      prev.map((poly) => (poly.id === id ? { ...poly, ...updates } : poly))
    );
  };

  const addPolygon = (points: Point[]) => {
    const colorIndex = polygons.length % COLORS.length;
    setPolygons((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        points,
        color: colorIndex.toString(),
        name: `${COLORS[colorIndex].name} ${prev.length + 1}`,
        details: "New region - Add description",
      },
    ]);
  };

  return {
    polygons,
    setPolygons,
    activePolygon,
    setActivePolygon,
    activePointIndex,
    setActivePointIndex,
    isDrawing,
    setIsDrawing,
    tempPoints,
    setTempPoints,
    editingPolygon,
    setEditingPolygon,
    hoveredPolygon,
    setHoveredPolygon,
    deletePolygon,
    updatePolygon,
    addPolygon,
  };
}
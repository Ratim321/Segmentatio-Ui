import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ReportTooltip } from "./ReportTooltip";
import { MassReport, AxillaReport, CalcificationReport, BreastTissueReport } from "../types/medical";

const REGION_CONFIGS = [
  {
    type: 'mass',
    color: '#1CED3A',
    report: {
      definition: "Well-defined",
      density: "High Dense",
      shape: "Oval"
    } as MassReport
  },
  {
    type: 'calcification',
    color: '#d86b3c',
    report: {
      type: "Cluster/Grouped"
    } as CalcificationReport
  },
  {
    type: 'axilla',
    color: '#F06EAA',
    report: {
      findings: true
    } as AxillaReport
  },
  {
    type: 'tissue',
    color: '#089BD8',
    report: {
      density: "Heterogeneously Dense"
    } as BreastTissueReport
  }
];

const isSimilarColor = (color1: string, color2: string, tolerance: number = 30) => {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  return Math.abs(r1 - r2) <= tolerance && 
         Math.abs(g1 - g2) <= tolerance && 
         Math.abs(b1 - b2) <= tolerance;
};

const ImageSegmentation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentRegion, setCurrentRegion] = useState<typeof REGION_CONFIGS[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = '/Asset 2.png';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    setMousePos({ x: e.clientX, y: e.clientY });

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

    const region = REGION_CONFIGS.find(r => isSimilarColor(r.color.toLowerCase(), color.toLowerCase()));
    setCurrentRegion(region || null);
  };

  const handleMouseLeave = () => {
    setCurrentRegion(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Medical Image Analysis</h1>
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="max-w-full h-auto cursor-crosshair border border-gray-200 rounded-lg"
          />
          {currentRegion && (
            <div
              className="absolute z-50"
              style={{
                left: `${mousePos.x + 20}px`,
                top: `${mousePos.y}px`
              }}
            >
              <ReportTooltip
                type={currentRegion.type as "mass" | "axilla" | "calcification" | "breastTissue"}
                data={currentRegion.report}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSegmentation;

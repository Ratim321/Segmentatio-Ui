import React, { useEffect, useRef, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { ReportTooltip } from "./ReportTooltip";
import { processImageReport } from '../../../lib/utils';
import { imageReports } from '../../../data/reports';
import { MedicalReport } from './MedicalReport';

const REGION_CONFIGS = processImageReport(imageReports[0]);

const isSimilarColor = (color1: string, color2: string, tolerance: number = 30) => {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);

  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);

  return Math.abs(r1 - r2) <= tolerance && Math.abs(g1 - g2) <= tolerance && Math.abs(b1 - b2) <= tolerance;
};

const ImageSegmentation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<typeof imageReports[0] | null>(null);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<ReturnType<typeof processImageReport>[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const image = imageReports[0].img;
    setSelectedImage(image);
    setShowSegmentation(false);
    setCurrentReport(imageReports[0]);
    setCurrentRegion(null);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  const handlePredict = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const report = imageReports.find(r => r.img === selectedImage);
    if (report) {
      setCurrentReport(report);
      setShowSegmentation(true);
    }
    setIsLoading(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    
    setMousePos({ 
      x: e.clientX + 15,
      y: e.clientY - 10
    });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;

    const region = REGION_CONFIGS.find((r) => isSimilarColor(r.color.toLowerCase(), color.toLowerCase()));
    setCurrentRegion(region || null);
    setIsHovering(!!region);
    setActiveSection(region?.type || null);
  };

  const handleMouseLeave = () => {
    setCurrentRegion(null);
    setIsHovering(false);
    setActiveSection(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            className={`
              max-w-full h-auto 
              border border-gray-200 dark:border-gray-700 rounded-lg 
              ${isHovering ? 'cursor-crosshair' : 'cursor-default'}
              transition-all duration-300
            `}
          />
          {currentRegion && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-out'
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
      <div className="lg:col-span-1">
        <MedicalReport activeSection={activeSection} report={currentReport} />
      </div>
    </div>
  );
};

export default ImageSegmentation;
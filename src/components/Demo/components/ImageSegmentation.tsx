import React, { useEffect, useRef, useState } from "react";

import "react-tooltip/dist/react-tooltip.css";
import { ReportTooltip } from "./ReportTooltip";
import { Gallery } from "./Gallery";
import { processImageReport } from "../../../lib/utils";
import { imageReports } from "../../../data/reports";

// Initialize with the first report
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
  const [currentReport, setCurrentReport] = useState<(typeof imageReports)[0] | null>(null);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<ReturnType<typeof processImageReport>[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
    setShowSegmentation(false);
    setCurrentReport(null);
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleImageSelect(url);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const report = imageReports.find((r) => r.img === selectedImage);
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
    setMousePos({ x: e.clientX, y: e.clientY });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;

    const region = REGION_CONFIGS.find((r) => isSimilarColor(r.color.toLowerCase(), color.toLowerCase()));
    setCurrentRegion(region || null);
  };

  const handleMouseLeave = () => {
    setCurrentRegion(null);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Medical Image Analysis</h1>

        {/* Gallery Section */}
        <Gallery images={imageReports.map((r) => r.img)} selectedImage={selectedImage} onImageSelect={handleImageSelect} onFileUpload={handleFileUpload} />

        {/* Canvas Section */}
        <div className="relative mt-6">
          <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="max-w-full h-auto cursor-crosshair border border-gray-200 rounded-lg" />
          {!selectedImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Select an image from the gallery or upload one</p>
            </div>
          )}
          {currentRegion && showSegmentation && (
            <div
              className="absolute z-50"
              style={{
                left: `${mousePos.x + 5}px`,
                top: `${mousePos.y}px`,
              }}
            >
              <ReportTooltip type={currentRegion.type as "mass" | "axilla" | "calcification" | "breastTissue"} data={currentRegion.report} />
            </div>
          )}
        </div>

        {/* Predict Button */}
        {selectedImage && !showSegmentation && (
          <div className="mt-4 flex justify-center">
            <button onClick={handlePredict} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSegmentation;

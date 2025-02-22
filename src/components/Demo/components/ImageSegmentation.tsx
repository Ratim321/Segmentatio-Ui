import React, { useEffect, useRef, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { ReportTooltip } from "./ReportTooltip";
import { processImageReport } from "../../../lib/utils";
import { imageReports } from "../../../data/reports";
import { MedicalReport } from "./MedicalReport";
import { Gallery } from "./Gallery";
import { ComparisonModal } from "./ComparisonModal";

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
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const handlePredict = async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    setTimeout(() => {
      setCurrentReport(imageReports[0]);
      setShowSegmentation(true);
      setIsLoading(false);
    }, 3000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !showSegmentation || !currentReport) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    setMousePos({
      x: e.clientX + 15,
      y: e.clientY - 10,
    });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const size = 3;
    const halfSize = Math.floor(size / 2);
    const pixels = ctx.getImageData(Math.max(0, x - halfSize), Math.max(0, y - halfSize), size, size).data;

    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
    }
    const pixelCount = size * size;
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

    const color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    const region = REGION_CONFIGS.find((reg) => isSimilarColor(reg.color, color, 20));

    if (region) {
      setCurrentRegion(region);
      setIsHovering(true);
      setActiveSection(region.type);
    } else {
      setCurrentRegion(null);
      setIsHovering(false);
      setActiveSection(null);
    }
  };

  const handleMouseLeave = () => {
    setCurrentRegion(null);
    setIsHovering(false);
    setActiveSection(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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

  const LoadingScreen = () => (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center rounded-lg z-50">
      <div className="relative flex flex-col items-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-lg animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[shimmer_2s_infinite]"></div>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping [animation-delay:0.3s]"></div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-mono text-white mb-2">Extracting Features</h3>
          <div className="flex items-center gap-1 justify-center text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>

        <div className="mt-6 w-48">
          <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-full animate-[progress_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Gallery images={imageReports.map((r) => r.img)} selectedImage={selectedImage} onImageSelect={handleImageSelect} onFileUpload={handleFileUpload} />

        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`
              max-w-full h-auto 
              border border-gray-200 dark:border-gray-700 rounded-lg 
              ${showSegmentation ? "cursor-crosshair" : "cursor-default"}
              transition-all duration-300
            `}
          />
          {!selectedImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Select an image from the gallery above</p>
            </div>
          )}
          {isLoading && <LoadingScreen />}
          {currentRegion && showSegmentation && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <ReportTooltip type={currentRegion.type as "mass" | "axilla" | "calcification" | "breast tissue"} data={currentRegion.report} />
            </div>
          )}
        </div>
        {selectedImage && !showSegmentation && (
          <div className="mt-4 flex justify-center">
            <button onClick={handlePredict} disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isLoading ? "Analyzing..." : "Analyze Image"}
            </button>
          </div>
        )}
        {showSegmentation && currentReport && (
          <div className="mt-4 flex justify-center">
            <button onClick={() => setIsComparisonModalOpen(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Compare with Other Cases
            </button>
          </div>
        )}
      </div>
      <div className="lg:col-span-1">{showSegmentation && currentReport && <MedicalReport report={currentReport} activeSection={currentRegion?.type || null} />}</div>

      {currentReport && <ComparisonModal currentReport={currentReport} isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} />}
    </div>
  );
};

export default ImageSegmentation;

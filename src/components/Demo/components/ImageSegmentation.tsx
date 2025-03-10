import React, { useEffect, useRef, useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { ReportTooltip } from "./ReportTooltip";
import { processImageReport } from "../../../lib/utils";
import { imageReports } from "../../../data/reports";
import { MedicalReport } from "./MedicalReport";
import { Gallery } from "./Gallery";
import { ComparisonModal } from "./ComparisonModal";
import { Layers } from "lucide-react";
import { Client } from "@gradio/client";

type RegionConfig = ReturnType<typeof processImageReport>[0];
type ImageReport = (typeof imageReports)[0];

const REGION_CONFIGS = processImageReport(imageReports[0]);

const isSimilarColor = (color1: string, color2: string, tolerance: number = 30): boolean => {
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

const LoadingScreen: React.FC = () => (
  <div className="absolute inset-0 w-auto bg-gray-900/80 backdrop-blur-2xl flex items-center justify-center rounded-lg z-50">
    <div className="relative flex flex-col items-center w-full">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-cyan-500/20 rounded-lg animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping [animation-delay:0.3s]"></div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-mono text-white mb-2">Analyzing Image</h3>
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

const ImageSegmentation: React.FC = () => {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<ImageReport | null>(null);
  const [tabularReport, setTabularReport] = useState<string | null>(null); // State for tabular report
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<RegionConfig | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const HF_TOKEN = "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";
  const SEGMENTATION_SPACE_ID = "ratyim/segmentationbreast"; // Segmentation API
  const TABULAR_SPACE_ID = "ratyim/breast_tabular"; // Tabular report API

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      handleImageSelect(url);
    }
  };

  const handleImageSelect = (image: string) => {
    const report = imageReports.find((r) => r.input_img === image);
    if (report) {
      setSelectedImage(image);
      setCurrentReport(report);
      setTabularReport(null); // Reset tabular report for gallery images
      setShowSegmentation(false);
      setCurrentRegion(null);
      setActiveSection(null);
    } else {
      setSelectedImage(image);
      setCurrentReport(null); // No predefined report for uploaded images
      setTabularReport(null);
      setShowSegmentation(false);
      setCurrentRegion(null);
      setActiveSection(null);
    }

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const inputCanvas = inputCanvasRef.current;
      if (!inputCanvas) return;

      const ctx = inputCanvas.getContext("2d");
      if (!ctx) return;

      inputCanvas.width = img.width;
      inputCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  };

  const handlePredict = async () => {
    if (!selectedImage || (!uploadedImage && !currentReport)) return;

    setIsLoading(true);

    try {
      if (uploadedImage) {
        // 1. Get segmentation from segmentationbreast API
        const segmentationClient = await Client.connect(SEGMENTATION_SPACE_ID, {
          hf_token: HF_TOKEN,
        });

        const segmentationResult = await segmentationClient.predict("/predict", {
          input_image: uploadedImage,
        });

        console.log("Segmentation API Response:", segmentationResult.data);

        const segmentedImageData = segmentationResult.data[0];
        const segmentedImageUrl = segmentedImageData.url || `https://huggingface.co/spaces/${SEGMENTATION_SPACE_ID}/resolve/main/${segmentedImageData.path}`;

        const outputCanvas = outputCanvasRef.current;
        if (!outputCanvas) throw new Error("Output canvas not found");

        const ctx = outputCanvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not available");

        const img = new Image();
        img.src = segmentedImageUrl;
        console.log("Setting img.src to:", img.src);

        img.onload = () => {
          outputCanvas.width = img.width;
          outputCanvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          setShowSegmentation(true);
        };
        img.onerror = (e) => {
          console.error("Segmentation image load error:", e);
          throw new Error("Failed to load segmented image");
        };

        // 2. Get tabular report from breast_tabular API
        const tabularClient = await Client.connect(TABULAR_SPACE_ID, {
          hf_token: HF_TOKEN,
        });

        const tabularResult = await tabularClient.predict("/predict", {
          image: uploadedImage,
        });

        console.log("Tabular API Response:", tabularResult.data);

        const reportText = tabularResult.data[0];
        setTabularReport(reportText);
      } else if (currentReport) {
        const outputCanvas = outputCanvasRef.current;
        if (!outputCanvas) return;

        const ctx = outputCanvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = currentReport.output_img;
        img.onload = () => {
          outputCanvas.width = img.width;
          outputCanvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          setShowSegmentation(true);
        };
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert(`Failed to analyze image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showSegmentation || (!currentReport && !uploadedImage)) return;

    const outputCanvas = outputCanvasRef.current;
    if (!outputCanvas) return;

    const rect = outputCanvas.getBoundingClientRect();
    const scaleX = outputCanvas.width / rect.width;
    const scaleY = outputCanvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    setMousePos({
      x: e.clientX + 15,
      y: e.clientY - 10,
    });

    const ctx = outputCanvas.getContext("2d", { willReadFrequently: true });
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

    if (region && currentReport) {
      const reportData = currentReport.report.find((item) => item.type === region.type);
      if (reportData) {
        if (currentReport.id === 2 && region.type === "calcification") {
          setCurrentRegion({
            ...region,
            report: { ...reportData, found: 0 },
          });
          setIsHovering(true);
        } else if (reportData.found === 1) {
          setCurrentRegion({
            ...region,
            report: reportData,
          });
          setIsHovering(true);
        }
      }
    } else {
      setCurrentRegion(null);
      setIsHovering(false);
    }
  };

  const handleMouseLeave = () => {
    setCurrentRegion(null);
    setIsHovering(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="h-full grid grid-cols-[300px_1fr_500px] gap-6 p-6">
        {/* Left Column - Gallery */}
        <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-4 shadow-lg overflow-y-auto">
          <Gallery
            images={imageReports.map((r) => r.input_img)}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* Middle Column - Image Display */}
        <div className="relative h-full bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="h-full flex items-start" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="relative h-full" style={{ aspectRatio: "auto" }}>
              {/* Input Image Layer */}
              <canvas
                ref={inputCanvasRef}
                className={`
                  absolute top-0 left-0 z-20
                  h-full w-full
                  dark:border-gray-700 
                  ${showSegmentation ? "cursor-crosshair" : "cursor-default"}
                  transition-all duration-300
                `}
                style={{ opacity: showSegmentation ? opacity : 1 }}
              />

              {/* Output Image Layer */}
              <canvas
                ref={outputCanvasRef}
                className={`
                  h-full w-full
                  dark:border-gray-700
                  ${showSegmentation ? "cursor-crosshair" : "cursor-default"}
                  transition-all duration-300
                `}
              />
            </div>

            {/* Placeholder Hero Section */}
            {!selectedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-grid-gray-900/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                </div>

                <div className="relative flex flex-col items-center text-center p-8 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse bg-cyan-500/20 rounded-full blur-xl"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-white animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Medical Image Analysis</h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md animate-fade-in">Select an image from the gallery or upload your own to begin advanced medical analysis using our AI-powered technology.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Screen */}
            {isLoading && <LoadingScreen />}

            {/* Tooltip (for gallery images with segmentation) */}
            {currentRegion && showSegmentation && currentReport && (
              <div
                className="fixed z-50 pointer-events-none"
                style={{
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                }}
              >
                <ReportTooltip
                  type={currentRegion.type as "mass" | "axilla" | "calcification" | "breast tissue"}
                  data={currentRegion.report}
                  birads={currentReport?.BIRADS}
                  comments={currentReport?.comment}
                />
              </div>
            )}

            {/* Opacity Slider */}
            {showSegmentation && (
              <div className="absolute top-4 right-4 bg-gray-800/50 backdrop-blur-md p-3 rounded-lg shadow-lg z-30 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <div className="w-32 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="
                        appearance-none bg-gradient-to-r from-cyan-400/20 to-cyan-400/5
                        rounded-lg overflow-hidden w-full h-1.5
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:bg-cyan-400
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-gray-700/50
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:shadow-cyan-400/30
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                  </div>
                  <span className="text-xs text-cyan-400 font-medium whitespace-nowrap">
                    Toggle View
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Analysis Controls and Report */}
        <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6 shadow-lg overflow-y-auto">
          {selectedImage && !showSegmentation && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Image Analysis</h3>
              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Analyzing..." : "Analyze Image"}
              </button>
            </div>
          )}

          {showSegmentation && (
            <>
              {/* Display API report for uploaded images with hover effect */}
              {tabularReport && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Prediction Report</h3>
                  <div
                    className="bg-gray-700/50 p-4 rounded-lg text-sm text-gray-200 hover:bg-gray-600/70 transition-colors duration-200 cursor-pointer"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#374151")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  >
                    <pre className="whitespace-pre-wrap">
                      {tabularReport.split("\n").map((line, index) => (
                        <div key={index} className="py-1 border-b border-gray-600/50 last:border-b-0">
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              )}

              {/* Display gallery report if available */}
              {currentReport && (
                <>
                  <MedicalReport report={currentReport} activeSection={activeSection} />
                  <button
                    onClick={() => setIsComparisonModalOpen(true)}
                    className="w-full text-lg px-6 py-3 mt-6 border border-green-700 hover:border-green-700 bg-green-700 hover:dark:bg-gray-800 hover:dark:text-white text-white rounded-lg hover:bg-white hover:text-green-700 transition-colors"
                  >
                    Compare with Other Cases
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {currentReport && (
        <ComparisonModal
          currentReport={currentReport}
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageSegmentation;

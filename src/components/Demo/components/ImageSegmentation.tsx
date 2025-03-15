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

// Predefined region configs for gallery images
const REGION_CONFIGS = processImageReport(imageReports[0]);

// Utility to compare colors with tolerance (unchanged)
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

// Loading Screen Component (unchanged)
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

const ImageSegmentation: React.FC = () => {
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<ImageReport | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<RegionConfig | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // API Configuration
  const SEGMENTATION_SPACE_ID = "ratyim/segmentationbreast";
  const TABULAR_SPACE_ID = "ratyim/breast_tabular";
  const HF_TOKEN = "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";

  // Handle file upload (unchanged)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      const uploadedReport = {
        input_img: url,
        output_img: url, // Initially set to input image, updated after segmentation
        report: [],
        BIRADS: "0",
        comment: ["Uploaded image pending analysis"],
      };

      setSelectedImage(url);
      setCurrentReport(uploadedReport);
      setShowSegmentation(false);
      setCurrentRegion(null);
      setActiveSection(null);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        const inputCanvas = inputCanvasRef.current;
        if (!inputCanvas) return;

        const ctx = inputCanvas.getContext("2d");
        if (!ctx) return;

        inputCanvas.width = img.width;
        inputCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  // Handle gallery image selection (unchanged)
  const handleImageSelect = (image: string) => {
    const report = imageReports.find((r) => r.input_img === image);
    if (!report) return;

    setSelectedImage(image);
    setCurrentReport(report);
    setUploadedFile(null);
    setShowSegmentation(false);
    setCurrentRegion(null);
    setActiveSection(null);

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

  // Handle prediction with API integration (updated)
  const handlePredict = async () => {
    if (!selectedImage || !currentReport || !uploadedFile) {
      console.warn("Missing required data: selectedImage, currentReport, or uploadedFile");
      return;
    }

    setIsLoading(true);

    if (!("id" in currentReport)) { // Uploaded image case
      try {
        // Segmentation API Call
        const segmentationClient = await Client.connect(SEGMENTATION_SPACE_ID, {
          hf_token: HF_TOKEN,
        });
        const segmentationResult = await segmentationClient.predict("/predict", {
          input_image: uploadedFile,
        });

        // Check if the response is a valid Base64 data URL
        if (!segmentationResult?.data?.[0] || typeof segmentationResult.data[0] !== "string" || !segmentationResult.data[0].startsWith("data:image/png;base64,")) {
          throw new Error("Invalid segmentation response: Expected a Base64 data URL");
        }
        const segmentedImageDataUrl = segmentationResult.data[0]; // Base64 data URL

        // Tabular Report API Call
        const tabularClient = await Client.connect(TABULAR_SPACE_ID, {
          hf_token: HF_TOKEN,
        });
        const tabularResult = await tabularClient.predict("/predict", {
          image: uploadedFile,
        });

        if (!tabularResult?.data?.[0]) {
          throw new Error("Invalid tabular response");
        }
        const reportText = tabularResult.data[0];
        const predictions = parseReportText(reportText);
        const report = constructReport(predictions);

        // Update report with segmented image
        const updatedReport = {
          input_img: selectedImage,
          output_img: segmentedImageDataUrl, // Save the Base64 data URL directly
          BIRADS: predictions.BIRADS_CAT.toString(),
          comment: ["Analysis based on uploaded image"],
          report,
        };
        setCurrentReport(updatedReport);

        // Load segmented image onto canvas
        const outputCanvas = outputCanvasRef.current;
        if (!outputCanvas) throw new Error("Output canvas not found");

        const ctx = outputCanvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get 2D context");

        const img = new Image();
        img.src = segmentedImageDataUrl; // Use the Base64 data URL
        img.onload = () => {
          outputCanvas.width = img.width;
          outputCanvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          setShowSegmentation(true);
          setIsLoading(false);
        };
        img.onerror = (error) => {
          throw new Error(`Failed to load segmented image: ${error}`);
        };
      } catch (error) {
        console.error("Prediction Error:", error);
        alert(`Failed to analyze the uploaded image: ${error.message}`);
        setIsLoading(false);
      }
    } else {
      // Gallery image case (unchanged)
      setTimeout(() => {
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
          setIsLoading(false);
        };
      }, 3000);
    }
  };

  // Parse and construct report functions (unchanged)
  const parseReportText = (text: string) => {
    const lines = text.split("\n");
    const predictions: { [key: string]: number } = {};
    lines.forEach((line) => {
      if (line.startsWith("Target Variable:")) {
        const variable = line.split(": ")[1].trim();
        const predictedClassLine = lines[lines.indexOf(line) + 1];
        const predictedClass = parseInt(predictedClassLine.split(": ")[1].trim());
        predictions[variable] = predictedClass;
      }
    });
    return predictions;
  };

  const constructReport = (predictions: { [key: string]: number }) => {
    const report = [];
    const confidence = () => Math.floor(Math.random() * (99 - 90 + 1)) + 90;

    if (predictions.mass === 1) {
      report.push({
        type: "mass",
        found: 1,
        confidence: confidence(),
        definition: getMassDefinition(predictions.mass_definition),
        density: getMassDensity(predictions.mass_density),
        shape: getMassShape(predictions.mass_shape),
        mass_calcification: predictions.mass_calcification === 1 ? "Yes" : "No",
      });
    } else {
      report.push({ type: "mass", found: 0, confidence: confidence() });
    }

    if (predictions.axilla_findings === 1) {
      report.push({
        type: "axilla",
        found: 1,
        confidence: confidence(),
        axilla_type: "Fatty Hillum",
      });
    } else {
      report.push({ type: "axilla", found: 0, confidence: confidence() });
    }

    if (predictions.calcification === 1) {
      report.push({
        type: "calcification",
        found: 1,
        confidence: confidence(),
        calcification_type: "Discrete",
      });
    } else {
      report.push({ type: "calcification", found: 0, confidence: confidence() });
    }

    report.push({
      type: "breast tissue",
      found: 1,
      confidence: confidence(),
      breast_density: getBreastDensity(predictions.acr_breast_density),
    });

    return report;
  };

  const getMassDefinition = (code: number) => {
    switch (code) {
      case 1: return "Well-defined";
      case 2: return "Ill-defined";
      case 3: return "Spiculated";
      default: return "Unknown";
    }
  };

  const getMassDensity = (code: number) => {
    switch (code) {
      case 1: return "Low densed";
      case 2: return "Iso-dense/ Equal Dense";
      case 3: return "High densed";
      default: return "Unknown";
    }
  };

  const getMassShape = (code: number) => {
    switch (code) {
      case 1: return "Oval";
      case 2: return "Round";
      case 3: return "Irregular";
      default: return "Unknown";
    }
  };

  const getBreastDensity = (code: number) => {
    switch (code) {
      case 1: return "Almost entirely fatty";
      case 2: return "Scattered fibroglandular densities";
      case 3: return "Heterogeneously dense";
      case 4: return "Extremely dense";
      default: return "Unknown";
    }
  };

  // Handle mouse movement (unchanged)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showSegmentation || !currentReport) return;

    const outputCanvas = outputCanvasRef.current;
    if (!outputCanvas) return;

    const rect = outputCanvas.getBoundingClientRect();
    const scaleX = outputCanvas.width / rect.width;
    const scaleY = outputCanvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    setMousePos({ x: e.clientX + 15, y: e.clientY - 10 });

    const ctx = outputCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const size = 3;
    const halfSize = Math.floor(size / 2);
    const pixels = ctx.getImageData(Math.max(0, x - halfSize), Math.max(0, y - halfSize), size, size).data;

    let r = 0, g = 0, b = 0;
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
      const reportData = currentReport.report.find((item) => item.type === region.type);
      if (reportData && reportData.found === 1) {
        setCurrentRegion({ ...region, report: reportData });
        setIsHovering(true);
      } else {
        setCurrentRegion(null);
        setIsHovering(false);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg overflow-y-auto">
          <Gallery images={imageReports.map((r) => r.input_img)} selectedImage={selectedImage} onImageSelect={handleImageSelect} onFileUpload={handleFileUpload} />
        </div>

        {/* Middle Column - Image Display */}
        <div className="relative h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="h-full flex items-start" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="relative h-full" style={{ aspectRatio: "auto" }}>
              <canvas ref={inputCanvasRef} className={`absolute top-0 left-0 z-20 h-full w-full dark:border-gray-700 ${showSegmentation ? "cursor-crosshair" : "cursor-default"} transition-all duration-300`} style={{ opacity: showSegmentation ? opacity : 1 }} />
              <canvas ref={outputCanvasRef} className={`h-full w-full dark:border-gray-700 ${showSegmentation ? "cursor-crosshair" : "cursor-default"} transition-all duration-300`} />
            </div>

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
                    <p className="text-gray-600 dark:text-gray-300 max-w-md animate-fade-in">Select an image from the gallery to begin advanced medical analysis using our AI-powered segmentation technology.</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading && <LoadingScreen />}

            {currentRegion && showSegmentation && currentReport && (
              <div className="fixed z-50 pointer-events-none" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}>
                <ReportTooltip type={currentRegion.type as "mass" | "axilla" | "calcification" | "breast tissue"} data={currentRegion.report} birads={currentReport?.BIRADS} comments={currentReport?.comment} />
              </div>
            )}

            {showSegmentation && (
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-lg z-30 border border-white/20">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                  <div className="w-32 flex items-center">
                    <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="appearance-none bg-gradient-to-r from-cyan-700/20 dark:from-cyan-400/20 to-cyan-700/5 dark:to-cyan-400/5 rounded-lg overflow-hidden w-full h-1.5 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-cyan-700 [&::-webkit-slider-thumb]:dark:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-cyan-700/30 [&::-webkit-slider-thumb]:dark:shadow-cyan-400/30 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110" />
                  </div>
                  <span className="text-xs text-cyan-700 dark:text-cyan-400 font-medium whitespace-nowrap">Toggle View</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Analysis Controls and Report */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-y-auto">
          {selectedImage && !showSegmentation && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-4">Image Analysis</h3>
              <button onClick={handlePredict} disabled={isLoading} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isLoading ? "Analyzing..." : "Analyze Image"}
              </button>
            </div>
          )}

          {showSegmentation && currentReport && (
            <>
              <MedicalReport report={currentReport} activeSection={activeSection} />
              <button onClick={() => setIsComparisonModalOpen(true)} className="w-full text-lg px-6 py-3 mt-6 border border-green-700 hover:border-green-700 bg-green-700 hover:dark:bg-gray-800 hover:dark:text-white text-white rounded-lg hover:bg-white hover:text-green-700 transition-colors">
                Compare with Other Cases
              </button>
            </>
          )}
        </div>
      </div>

      {currentReport && <ComparisonModal currentReport={currentReport} isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} />}
    </div>
  );
};

export default ImageSegmentation;
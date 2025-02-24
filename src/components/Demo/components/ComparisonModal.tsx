import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Layers } from "lucide-react";
import { imageReports } from "../../../data/reports";
import { MedicalReport } from "./MedicalReport";
import jsPDF from 'jspdf';

interface ComparisonModalProps {
  currentReport: (typeof imageReports)[0];
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal = ({ currentReport, isOpen, onClose }: ComparisonModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const otherReports = imageReports.filter((report) => report.id !== currentReport.id);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right" | null>(null);
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [comparisonOpacity, setComparisonOpacity] = useState(1);

  const currentInputCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentOutputCanvasRef = useRef<HTMLCanvasElement>(null);
  const comparisonInputCanvasRef = useRef<HTMLCanvasElement>(null);
  const comparisonOutputCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleNext = () => {
    setAnimationDirection("right");
    setCurrentIndex((prev) => (prev + 1) % otherReports.length);
  };

  const handlePrevious = () => {
    setAnimationDirection("left");
    setCurrentIndex((prev) => (prev - 1 + otherReports.length) % otherReports.length);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleArrowKeys);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleArrowKeys);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Load current report images
    const currentInputImg = new Image();
    currentInputImg.src = currentReport.input_img;
    currentInputImg.onload = () => {
      const canvas = currentInputCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = currentInputImg.width;
      canvas.height = currentInputImg.height;
      ctx.drawImage(currentInputImg, 0, 0);
    };

    const currentOutputImg = new Image();
    currentOutputImg.src = currentReport.output_img;
    currentOutputImg.onload = () => {
      const canvas = currentOutputCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = currentOutputImg.width;
      canvas.height = currentOutputImg.height;
      ctx.drawImage(currentOutputImg, 0, 0);
    };

    // Load comparison report images
    const comparisonInputImg = new Image();
    comparisonInputImg.src = otherReports[currentIndex].input_img;
    comparisonInputImg.onload = () => {
      const canvas = comparisonInputCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = comparisonInputImg.width;
      canvas.height = comparisonInputImg.height;
      ctx.drawImage(comparisonInputImg, 0, 0);
    };

    const comparisonOutputImg = new Image();
    comparisonOutputImg.src = otherReports[currentIndex].output_img;
    comparisonOutputImg.onload = () => {
      const canvas = comparisonOutputCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = comparisonOutputImg.width;
      canvas.height = comparisonOutputImg.height;
      ctx.drawImage(comparisonOutputImg, 0, 0);
    };
  }, [isOpen, currentIndex, currentReport, otherReports]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center overflow-y-auto p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="
          relative w-full max-w-7xl rounded-2xl overflow-hidden
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(0,0,0,0.2)]
          dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]
          my-auto
        "
        style={{ maxHeight: "85vh" }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Header */}
        <div className="relative border-b border-white/10 p-6 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="text-2xl font-semibold text-white">Case Comparison Analysis</h3>
            <p className="text-white/60 text-sm mt-1">Compare findings with similar cases</p>
          </div>
          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              hover:bg-white/10
              transition-colors
              group
            "
          >
            <X className="w-6 h-6 text-white/60 group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div
          className="relative p-6 overflow-y-auto 
                scrollbar-thin 
                scrollbar-track-scrollbar-track 
                scrollbar-thumb-scrollbar-thumb 
                hover:scrollbar-thumb-scrollbar-thumb-hover
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:rounded-full
              "
          style={{ maxHeight: "calc(85vh - 83px)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Case */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-blue-500 rounded-full" />
                <div>
                  <h4 className="text-lg font-medium text-white">Current Case</h4>
                  <p className="text-white/60 text-sm">Reference case for comparison</p>
                </div>
              </div>

              <div className="relative aspect-square bg-black/20 rounded-xl overflow-hidden border border-white/10">
                <canvas ref={currentInputCanvasRef} className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300" style={{ opacity: currentOpacity }} />
                <canvas ref={currentOutputCanvasRef} className="absolute inset-0 w-full h-full object-cover" />

                {/* Opacity Slider */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg z-30 border border-white/20">
                  <div className="flex flex-col items-center gap-3">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <div className="h-32 flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={currentOpacity}
                        onChange={(e) => setCurrentOpacity(parseFloat(e.target.value))}
                        className="-rotate-90 
                          appearance-none bg-gradient-to-t from-cyan-400/20 to-cyan-400/5
                          rounded-lg overflow-hidden w-32
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:bg-cyan-400
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:border-4
                          [&::-webkit-slider-thumb]:border-white/20
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:shadow-cyan-400/30
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                    </div>
                    <span className="text-xs text-cyan-400 font-medium text-center">
                      Slide down to view
                      <br />
                      input image
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                <MedicalReport 
                  report={currentReport} 
                  activeSection={null} 
                  onDownloadPDF={() => generatePDF(currentReport)}
                />
              </div>
            </div>

            {/* Comparison Case */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-purple-500 rounded-full" />
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      Comparison Case {currentIndex + 1} of {otherReports.length}
                    </h4>
                    <p className="text-white/60 text-sm">Similar cases for analysis</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevious}
                    className="
                      p-2 rounded-lg
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      transition-all
                      group
                    "
                    aria-label="Previous case"
                  >
                    <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="
                      p-2 rounded-lg
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      transition-all
                      group
                    "
                    aria-label="Next case"
                  >
                    <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white" />
                  </button>
                </div>
              </div>

              <div
                className={`
                  relative aspect-square bg-black/20 rounded-xl overflow-hidden border border-white/10
                  transition-all duration-500
                  ${animationDirection === "left" ? "animate-slide-left" : ""}
                  ${animationDirection === "right" ? "animate-slide-right" : ""}
                `}
                onAnimationEnd={() => setAnimationDirection(null)}
              >
                <canvas ref={comparisonInputCanvasRef} className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300" style={{ opacity: comparisonOpacity }} />
                <canvas ref={comparisonOutputCanvasRef} className="absolute inset-0 w-full h-full object-cover" />

                {/* Opacity Slider */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg z-30 border border-white/20">
                  <div className="flex flex-col items-center gap-3">
                    <Layers className="w-5 h-5 text-purple-400" />
                    <div className="h-32 flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={comparisonOpacity}
                        onChange={(e) => setComparisonOpacity(parseFloat(e.target.value))}
                        className="-rotate-90 
                          appearance-none bg-gradient-to-t from-purple-400/20 to-purple-400/5
                          rounded-lg overflow-hidden w-32
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:bg-purple-400
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:border-4
                          [&::-webkit-slider-thumb]:border-white/20
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:shadow-purple-400/30
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-110"
                      />
                    </div>
                    <span className="text-xs text-purple-400 font-medium text-center">
                      Slide down to view
                      <br />
                      input image
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                <MedicalReport report={otherReports[currentIndex]} activeSection={null} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

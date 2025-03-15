// MedicalReport.tsx
import React, { useState, useContext, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";
import { REGION_COLOR_MAP } from "../../../lib/constants";
import { generatePDFReport } from "./Report"; // Adjust the import path as needed

interface Finding {
  type: string;
  found: number;
  confidence?: number;
  [key: string]: any;
}

interface MedicalReportProps {
  report: {
    id?: string;
    input_img: string;
    output_img: string;
    report: Finding[];
    BIRADS?: string | number;
    comment?: string[];
  };
  activeSection?: string | null;
}

const FindingSection: React.FC<{
  finding: Finding;
  index: number;
  isExpanded: boolean;
  isActive: boolean;
  darkMode: boolean;
  onToggle: () => void;
}> = ({ finding, index, isExpanded, isActive, darkMode, onToggle }) => {
  return (
    <div
      className={`
        ${darkMode ? "border-gray-700" : "border-gray-200"} 
        border rounded-lg overflow-hidden
        ${isActive ? "ring-2 ring-yellow-400" : ""}
        transition-all duration-300
      `}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 p-4 
          ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"} 
          transition-colors`}
      >
        <div
          className="w-1.5 h-12 rounded-full"
          style={{
            backgroundColor: REGION_COLOR_MAP[finding.type as keyof typeof REGION_COLOR_MAP] || "#666",
          }}
        />
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col items-start justify-start">
              <h4 className="font-medium text-left capitalize">{finding.type}</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {finding.found ? "Present" : "Not Present"}
              </p>
            </div>
            {finding.confidence && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">
                {finding.confidence.toFixed(1)}%
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          ) : (
            <ChevronRight className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          )}
        </div>
      </button>
      {isExpanded && finding.found === 1 && (
        <div className={`px-4 pb-4 pt-2 ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
          <div className="space-y-2 pl-8">
            {Object.entries(finding).map(([key, value]) => {
              if (key !== "type" && key !== "found" && key !== "confidence") {
                return (
                  <p key={key} className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    <span className={darkMode ? "text-gray-400" : "text-gray-500"}>{key.replace(/_/g, " ")}:</span>{" "}
                    {value}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const MedicalReport: React.FC<MedicalReportProps> = ({ report, activeSection }) => {
  const { darkMode } = useContext(ThemeContext);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [segmentedImageUrl, setSegmentedImageUrl] = useState<string | null>(null);
  const [segmentedImageDataUrl, setSegmentedImageDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (activeSection) {
      const sectionIndex = report.report.findIndex((finding) => finding.type === activeSection);
      if (sectionIndex !== -1 && !expandedSections.includes(sectionIndex)) {
        setExpandedSections((prev) => [...prev, sectionIndex]);
      }
    }
  }, [activeSection, report.report, expandedSections]);

  // Save the URL to localStorage
  useEffect(() => {
    const saveSegmentedImageUrl = () => {
      const storageKey = `segmentedImageUrl_${report.id || report.output_img.split("/").pop() || "default"}`;
      const storedUrl = localStorage.getItem(storageKey);

      console.log(`Checking localStorage for key: ${storageKey}`);
      if (storedUrl) {
        console.log("Found stored URL in localStorage:", storedUrl);
        setSegmentedImageUrl(storedUrl);
      } else if (report.output_img) {
        console.log("No stored URL found, saving:", report.output_img);
        try {
          localStorage.setItem(storageKey, report.output_img);
          console.log(`Saved URL to localStorage under key: ${storageKey}, value: ${report.output_img}`);
          setSegmentedImageUrl(report.output_img);
        } catch (error) {
          console.error("Failed to save URL to localStorage:", error);
          setSegmentedImageUrl(report.output_img); // Fallback
        }
      } else {
        console.warn("No output_img provided in report");
        setSegmentedImageUrl(null);
      }
    };
    saveSegmentedImageUrl();
  }, [report.output_img, report.id]);

  // Fetch the image data URL from the stored URL
  useEffect(() => {
    const fetchSegmentedImageData = async () => {
      if (!segmentedImageUrl) {
        console.log("No segmented image URL available to fetch");
        setSegmentedImageDataUrl(null);
        return;
      }

      try {
        const dataUrl = await import("./Report").then((module) =>
          module.PDFGenerator.getImageDataUrl(segmentedImageUrl)
        );
        console.log("Fetched segmented image data URL:", dataUrl.substring(0, 50) + "...");
        setSegmentedImageDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to fetch segmented image data:", error);
        setSegmentedImageDataUrl(null);
      }
    };
    fetchSegmentedImageData();
  }, [segmentedImageUrl]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const handleDownloadPDF = () => {
    generatePDFReport(report, segmentedImageDataUrl, setIsGeneratingPDF);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-4 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Medical Report</h2>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
            ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-blue-100 hover:bg-blue-200 text-blue-700"}
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Download className="w-4 h-4" />
          {isGeneratingPDF ? "Generating..." : "Download PDF"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-center text-blue-600 dark:text-blue-400">Original Image</p>
            <div className="aspect-square bg-black/10 rounded-lg overflow-hidden">
              <img src={report.input_img} alt="Original" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium  text-center text-blue-600 dark:text-blue-400">Segmented Image</p>
            <div className="aspect-square bg-black/10 rounded-lg overflow-hidden">
              <img
                src={segmentedImageDataUrl || report.output_img}
                alt="Segmented"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {report.report.map((finding, index) => (
          <FindingSection
            key={index}
            finding={finding}
            index={index}
            isExpanded={expandedSections.includes(index)}
            isActive={activeSection === finding.type}
            darkMode={darkMode}
            onToggle={() => toggleSection(index)}
          />
        ))}

        {report.BIRADS && (
          <div className={`mt-6 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 mt-0.5 ${Number(report.BIRADS) >= 4 ? "text-red-500" : "text-yellow-500"}`}
              />
              <div>
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Assessment</h3>
                <div className="space-y-3">
                  <div
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${
                        Number(report.BIRADS) >= 4
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }
                    `}
                  >
                    BIRADS Category {report.BIRADS}
                  </div>
                  {report.comment && report.comment.length > 0 && (
                    <div className="space-y-2">
                      {report.comment.map((comment, index) => (
                        <p
                          key={index}
                          className={`
                            text-sm pl-4 border-l-2
                            ${darkMode ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-200"}
                          `}
                        >
                          {comment}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
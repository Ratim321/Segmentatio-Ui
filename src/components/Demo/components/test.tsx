import React, { useState, useContext, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { ThemeContext } from "../../../context/ThemeContext";
import { REGION_COLOR_MAP } from "../../../lib/constants";

const PDFGenerator = {
  getImageDataUrl: (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        reject(error);
      };

      // If the image is already a data URL, use it directly
      if (imageUrl.startsWith('data:')) {
        resolve(imageUrl);
      } else {
        img.src = imageUrl;
      }
    });
  },

  addImage: async (doc: jsPDF, imageUrl: string, x: number, y: number, width: number): Promise<number> => {
    try {
      const dataUrl = await PDFGenerator.getImageDataUrl(imageUrl);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          const height = width * aspectRatio;
          doc.addImage(dataUrl, 'JPEG', x, y, width, height);
          resolve(y + height);
        };
        img.src = dataUrl;
      });
    } catch (error) {
      console.error("Error processing image:", error);
      return Promise.resolve(y); // Return current Y position if image fails
    }
  },

  createInfoRow: (doc: jsPDF, label: string, value: string, x: number, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(label + ":", x, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, x + 60, y);
    return y + 10;
  },

  createTable: (doc: jsPDF, headers: string[], rows: string[][], startY: number, margin: number, width: number) => {
    const cellPadding = 5;
    const lineHeight = 10;
    const colWidth = width / headers.length;

    // Draw headers
    doc.setFont("helvetica", "bold");
    headers.forEach((header, i) => {
      doc.text(header, margin + (i * colWidth) + cellPadding, startY);
    });

    startY += lineHeight;
    doc.setFont("helvetica", "normal");

    // Draw rows
    rows.forEach(row => {
      row.forEach((cell, i) => {
        doc.text(cell, margin + (i * colWidth) + cellPadding, startY);
      });
      startY += lineHeight;
    });

    return startY;
  }
};

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
            {finding.confidence && <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">{finding.confidence.toFixed(1)}%</span>}
          </div>
          {isExpanded ? <ChevronDown className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} /> : <ChevronRight className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />}
        </div>
      </button>
      {isExpanded && finding.found === 1 && (
        <div className={`px-4 pb-4 pt-2 ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
          <div className="space-y-2 pl-8">
            {Object.entries(finding).map(([key, value]) => {
              if (key !== "type" && key !== "found" && key !== "confidence") {
                return (
                  <p key={key} className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    <span className={darkMode ? "text-gray-400" : "text-gray-500"}>{key.replace(/_/g, " ")}:</span> {value}
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

  useEffect(() => {
    if (activeSection) {
      const sectionIndex = report.report.findIndex((finding) => finding.type === activeSection);
      if (sectionIndex !== -1 && !expandedSections.includes(sectionIndex)) {
        setExpandedSections((prev) => [...prev, sectionIndex]);
      }
    }
  }, [activeSection, report.report, expandedSections]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const downloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - 2 * margin;
      let y = 30;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Medical Image Analysis Report", pageWidth / 2, y, { align: "center" });
      y += 20;

      // Add input and segmented images side by side
      const imageWidth = (contentWidth - 10) / 2; // 10px gap between images
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Original Image", margin, y);
      doc.text("Segmented Image", margin + imageWidth + 10, y);
      y += 10;

      try {
        // Add both images side by side
        const originalY = await PDFGenerator.addImage(doc, report.input_img, margin, y, imageWidth);
        const segmentedY = await PDFGenerator.addImage(doc, report.output_img, margin + imageWidth + 10, y, imageWidth);
        y = Math.max(originalY, segmentedY) + 20;
      } catch (error) {
        console.error("Error adding images to PDF:", error);
        y += 20; // Skip space if images fail to load
      }

      // Findings Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Findings", margin, y);
      y += 10;

      report.report.forEach((finding) => {
        if (finding.found === 1) {
          y += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(`${finding.type.toUpperCase()}`, margin, y);
          y += 8;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          Object.entries(finding).forEach(([key, value]) => {
            if (key !== "type" && key !== "found") {
              const label = key.replace(/_/g, " ");
              const text = `${label}: ${value}`;
              doc.text(text, margin + 10, y);
              y += 6;
            }
          });
        }
      });

      // BIRADS Assessment
      if (report.BIRADS) {
        y += 15;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Assessment", margin, y);
        y += 10;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`BIRADS Category: ${report.BIRADS}`, margin, y);
        
        if (report.comment) {
          y += 10;
          report.comment.forEach((comment) => {
            doc.text(`• ${comment}`, margin, y);
            y += 8;
          });
        }
      }

      // Footer
      const footerY = doc.internal.pageSize.height - 20;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text("This report is generated automatically and should be reviewed by a qualified medical professional.", margin, footerY);
      doc.text(new Date().toLocaleString(), pageWidth - margin, footerY, { align: "right" });

      // Save the PDF
      doc.save(`medical-report-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-6 rounded-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medical Report</h2>
        <button
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${darkMode 
              ? "bg-gray-800 hover:bg-gray-700 text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"}
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Download className="w-4 h-4" />
          {isGeneratingPDF ? "Generating..." : "Download PDF"}
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Preview of the images */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Original Image</p>
            <div className="aspect-square bg-black/20 rounded-lg overflow-hidden">
              <img src={report.input_img} alt="Original" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Segmented Image</p>
            <div className="aspect-square bg-black/20 rounded-lg overflow-hidden">
              <img src={report.output_img} alt="Segmented" className="w-full h-full object-contain" />
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

        {/* BIRADS and Comments Section */}
        {report.BIRADS && (
          <div className={`
            mt-8 pt-6 border-t
            ${darkMode ? "border-gray-700" : "border-gray-200"}
          `}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 ${Number(report.BIRADS) >= 4 ? "text-red-500" : "text-yellow-500"}`} />
              <div>
                <h3 className="text-lg font-medium mb-2">Assessment</h3>
                <div className="space-y-4">
                  <div className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${Number(report.BIRADS) >= 4 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}
                  `}>
                    BIRADS Category {report.BIRADS}
                  </div>
                  
                  {report.comment && report.comment.length > 0 && (
                    <div className="space-y-2">
                      {report.comment.map((comment, index) => (
                        <p key={index} className={`
                          text-sm pl-4 border-l-2
                          ${darkMode ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-200"}
                        `}>
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
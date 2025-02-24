import React, { useState, useContext, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { ThemeContext } from "../../../context/ThemeContext";
import { REGION_COLOR_MAP } from "../../../lib/constants";
// Add this after the imports
const PDFGenerator = {
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
    id: string;
    report: Finding[];
    BIRADS?: number;
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
          <div className="flex items-center gap-4">
            <div>
              <h4 className="font-medium text-left capitalize">{finding.type}</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Click to view details</p>
            </div>
            {finding.confidence && <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">{finding.confidence.toFixed(1)}%</span>}
          </div>
          {isExpanded ? <ChevronDown className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} /> : <ChevronRight className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />}
        </div>
      </button>
      {isExpanded && (
        <div className={`px-4 pb-4 pt-2 ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
          <div className="space-y-2 pl-8">
            {finding.type === "axilla" ? (
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Type:</span> {finding.axilla_type}
              </p>
            ) : (
              Object.entries(finding).map(([key, value]) => {
                if (key !== "type" && key !== "found" && key !== "confidence") {
                  return (
                    <p key={key} className={darkMode ? "text-gray-300" : "text-gray-600"}>
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>{key.replace(/_/g, " ")}:</span> {value}
                    </p>
                  );
                }
                return null;
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MedicalReport: React.FC<MedicalReportProps> = ({ report, activeSection }) => {
  const { darkMode } = useContext(ThemeContext);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

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

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - 2 * margin;
    let y = 30;

    // Patient Information
    let leftY = y;
    leftY = PDFGenerator.createInfoRow(doc, "ID No", report.id, margin, leftY);
    leftY = PDFGenerator.createInfoRow(doc, "PATIENT NAME", "Patient", margin, leftY);
    leftY = PDFGenerator.createInfoRow(doc, "PART OF EXAM", "MAMMOGRAPHY OF BOTH BREAST", margin, leftY);

    // Right column info
    let rightY = y;
    const rightColX = pageWidth - margin - 80;
    rightY = PDFGenerator.createInfoRow(doc, "DATE", new Date().toLocaleDateString(), rightColX, rightY);
    rightY = PDFGenerator.createInfoRow(doc, "SEX", "FEMALE", rightColX, rightY);
    rightY = PDFGenerator.createInfoRow(doc, "AGE", "N/A", rightColX, rightY);

    // Title
    y = Math.max(leftY, rightY) + 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("MAMMOGRAPHY REPORT OF BOTH BREASTS", pageWidth / 2, y, { align: "center" });

    y += 20;
    doc.setFontSize(12);

    // Mass findings table
    const massFindings = report.report.find((f) => f.type === "mass" && f.found);
    if (massFindings) {
      doc.setFont("helvetica", "bold");
      doc.text("Lesion type: Mass", margin, y);
      y += 15;

      const headers = ["Parameter", "Right Breast", "Left Breast"];
      const rows = [
        ["Number of lesion", "-", massFindings.number_of_lesions || "-"],
        ["Measurement", "-", massFindings.measurement || "-"],
        ["Shape", "-", massFindings.shape || "-"],
        ["Margins", "-", massFindings.margins || "-"],
        ["Density", "-", massFindings.density || "-"],
      ];

      y = PDFGenerator.createTable(doc, headers, rows, y, margin, contentWidth);
    }

    // Lymph node findings
    const axillaFindings = report.report.find((f) => f.type === "axilla" && f.found);
    if (axillaFindings) {
      y += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Lymph node", margin, y);
      y += 15;

      const headers = ["Location", "Findings"];
      const rows = [
        ["Right axilla", "Multiple with fatty hilum"],
        ["Left axilla", "Multiple with fatty hilum"],
      ];

      y = PDFGenerator.createTable(doc, headers, rows, y, margin, contentWidth);
    }

    // Footer
    y += 25;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("This report is generated automatically and should be reviewed by a qualified medical professional.", margin, y);

    // Page numbers
    doc.setFont("helvetica", "normal");
    doc.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 10, { align: "right" });

    doc.save(`medical-report-${report.id}.pdf`);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} 
      p-6 rounded-lg max-h-[600px] overflow-y-auto
      scrollbar-thin 
      scrollbar-track-gray-200 
      dark:scrollbar-track-gray-800
      scrollbar-thumb-blue-500 
      dark:scrollbar-thumb-blue-600
      hover:scrollbar-thumb-blue-600
      dark:hover:scrollbar-thumb-blue-500
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-track]:rounded-full
    `}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medical Report</h2>
        <button
          onClick={() => downloadPDF()}  // Make sure this is properly bound
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            ${darkMode 
              ? "bg-gray-800 hover:bg-gray-700 text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"}
            transition-colors
          `}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
      
      <div className="space-y-4">
        {report.report.map((finding, index) => finding.found === 1 && (
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
              <AlertCircle className={`w-5 h-5 mt-0.5 ${report.BIRADS >= 4 ? "text-red-500" : "text-yellow-500"}`} />
              <div>
                <h3 className="text-lg font-medium mb-2">Assessment</h3>
                <div className="space-y-4">
                  <div className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${report.BIRADS >= 4 
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
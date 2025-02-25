

import React, { useState, useContext, useEffect } from "react";
import { Download, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { ThemeContext } from "../../../context/ThemeContext";
import { REGION_COLOR_MAP } from "../../../lib/constants";

// PDF Generation Helper Functions
const PDFGenerator = {
  createHeader: (doc: jsPDF, margin: number, pageWidth: number) => {
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text("Medical Report", margin, margin + 10);
   
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, margin + 10);
   
    return margin + 25;
  },

  createInfoRow: (doc: jsPDF, label: string, value: string | number, x: number, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`${label}:`, x, y);
   
    doc.setFont("helvetica", "normal");
    doc.setTextColor(44, 62, 80);
    const valueText = String(value);
    const splitText = doc.splitTextToSize(valueText, 120); // Wrap long text
    doc.text(splitText, x + 40, y);
   
    return y + (splitText.length > 1 ? 10 + (splitText.length - 1) * 5 : 10);
  },

  createSection: (doc: jsPDF, title: string, x: number, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text(title, x, y);
    doc.setLineWidth(0.5);
    doc.setDrawColor(41, 128, 185);
    doc.line(x, y + 2, x + 40, y + 2); // Underline section title
    return y + 15;
  },

  createFindingDetails: (doc: jsPDF, finding: any, x: number, y: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);

    const excludeKeys = ["type", "found", "confidence", "clinical_note"];
    Object.entries(finding).forEach(([key, value]) => {
      if (!excludeKeys.includes(key)) {
        const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        y = PDFGenerator.createInfoRow(doc, label, String(value), x, y);
      }
    });

    if (finding.clinical_note) {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(52, 73, 94);
      doc.text("Clinical Note:", x, y);
      const noteText = doc.splitTextToSize(finding.clinical_note, 160);
      doc.text(noteText, x + 5, y + 5);
      y += 5 + noteText.length * 5;
    }

    return y + 5;
  },
};

interface Finding {
  type: string;
  found: number;
  confidence?: number;
  clinical_note?: string;
  [key: string]: any;
}

interface MedicalReportProps {
  report: {
    id: string | number;
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
        ${isActive ? "ring-2 ring-blue-400" : ""}
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
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-start">
              <h4 className="font-medium capitalize">{finding.type}</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {finding.found ? "Detected" : "Not Detected"}
              </p>
            </div>
            {finding.confidence && (
              <span
                className={`px-2 py-1 rounded-md text-sm font-medium ${
                  darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700"
                }`}
              >
                {finding.confidence.toFixed(1)}% Confidence
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
          <div className="space-y-3 pl-6">
            {Object.entries(finding).map(([key, value]) => {
              if (key === "type" || key === "found" || key === "confidence") return null;
              const label = key === "clinical_note" ? "Clinical Note" : key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
              return (
                <p
                  key={key}
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"} ${
                    key === "clinical_note" ? "italic mt-2" : ""
                  }`}
                >
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>{label}:</span>{" "}
                  {String(value)}
                </p>
              );
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

  useEffect(() => {
    if (activeSection) {
      const sectionIndex = report.report.findIndex((finding) => finding.type === activeSection);
      if (sectionIndex !== -1 && !expandedSections.includes(sectionIndex)) {
        setExpandedSections((prev) => [...prev, sectionIndex]);
      }
    }
  }, [activeSection, report.report, expandedSections]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    let y = PDFGenerator.createHeader(doc, margin, pageWidth);

    // Patient Information
    y = PDFGenerator.createSection(doc, "Patient Information", margin, y);
    y = PDFGenerator.createInfoRow(doc, "Patient ID", report.id, margin, y);
    y = PDFGenerator.createInfoRow(doc, "Date", new Date().toLocaleDateString(), margin, y);
    y += 5;

    // Findings
    y = PDFGenerator.createSection(doc, "Findings", margin, y);
    report.report.forEach((finding) => {
      if (finding.found) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(52, 73, 94);
        doc.text(finding.type.charAt(0).toUpperCase() + finding.type.slice(1), margin, y);
        y += 6;

        if (finding.confidence) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(46, 204, 113);
          doc.text(`Confidence: ${finding.confidence.toFixed(1)}%`, margin + 5, y);
          y += 8;
        }

        y = PDFGenerator.createFindingDetails(doc, finding, margin + 5, y);
      }
    });

    // Assessment
    if (report.BIRADS) {
      y = PDFGenerator.createSection(doc, "Assessment", margin, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(52, 73, 94);
      doc.text(`BIRADS Category: ${report.BIRADS}`, margin, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(44, 62, 80);
      doc.text(report.BIRADS === 3 ? "Probable benign finding" : "Further evaluation recommended", margin + 5, y);
      y += 8;

      if (report.comment) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        report.comment.forEach((comment) => {
          const splitComment = doc.splitTextToSize(`• ${comment}`, 170);
          doc.text(splitComment, margin + 5, y);
          y += splitComment.length * 5;
        });
      }
    }

    // Footer
    

    doc.save(`medical-report-${report.id}-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medical Report</h2>
        <button
          onClick={downloadPDF}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
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
          <div className={`mt-8 pt-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 mt-0.5 ${report.BIRADS >= 4 ? "text-red-500" : "text-blue-500"}`}
              />
              <div>
                <h3 className="text-lg font-medium mb-2">Assessment</h3>
                <div className="space-y-3">
                  <div
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${report.BIRADS >= 4
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}
                    `}
                  >
                    BIRADS Category {report.BIRADS}
                  </div>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {report.BIRADS === 3 ? "Probable benign finding" : "Further evaluation recommended"}
                  </p>
                  {report.comment && report.comment.length > 0 && (
                    <div className="space-y-2">
                      {report.comment.map((comment, index) => (
                        <p
                          key={index}
                          className={`text-sm pl-4 border-l-2 ${
                            darkMode ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-200"
                          }`}
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

import React, { useState } from "react";
import { Download, ChevronDown, ChevronRight } from "lucide-react";
import { jsPDF } from "jspdf";

import { REGION_COLOR_MAP } from "../../../lib/constants";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export const MedicalReport = ({ report, activeSection }: MedicalReportProps) => {
  const { darkMode } = useContext(ThemeContext);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // Update expanded sections when activeSection changes
  React.useEffect(() => {
    if (activeSection) {
      const sectionIndex = report.report.findIndex(finding => finding.type === activeSection);
      if (sectionIndex !== -1 && !expandedSections.includes(sectionIndex)) {
        setExpandedSections(prev => [...prev, sectionIndex]);
      }
    }
  }, [activeSection, report.report]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - 2 * margin;
    const maxY = pageHeight - margin - 15;
    let y = 60;

    const addWrappedText = (text: string, x: number, yPos: number, maxWidth: number) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPos > maxY) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, x, yPos);
        yPos += 10;
      });
      return yPos;
    };

    const addHeader = () => {
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("MediScan Labs", 20, 25);
      doc.setFontSize(12);
      doc.text("Advanced Medical Imaging Report", 20, 35);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.text(`Report ID: ${report.id}`, 140, 25);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 35);
    };

    addHeader();

    report.report.forEach((finding) => {
      if (finding.found) {
        if (y > maxY) {
          doc.addPage();
          addHeader();
          y = margin + 40;
        }

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y - 5, contentWidth, 20, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 41, 55);
        doc.setFontSize(14);
        doc.text(`${finding.type.toUpperCase()}`, margin + 5, y + 8);
        y += 25;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99);

        Object.entries(finding).forEach(([key, value]) => {
          if (key !== "type" && key !== "found") {
            if (y > maxY) {
              doc.addPage();
              y = margin;
            }

            if (key === "confidence") {
              doc.setTextColor(22, 163, 74);
              doc.circle(margin + 5, y - 2, 1, "F");
              doc.text(`Confidence: ${value.toFixed(1)}%`, margin + 15, y);
              doc.setTextColor(75, 85, 99);
            } else {
              doc.circle(margin + 5, y - 2, 1, "F");
              y = addWrappedText(`${key.replace(/_/g, " ")}: ${value}`, margin + 15, y, contentWidth - 20);
              y -= 10;
            }
            y += 10;
          }
        });

        y += 15;
      }
    });

    if (y > maxY) {
      doc.addPage();
      addHeader();
      y = margin + 40;
    }

    y += 10;
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y - 5, contentWidth, 20, "F");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(156, 163, 175);
    y = addWrappedText(
      "This report is generated automatically and should be reviewed by a qualified medical professional.",
      margin + 5,
      y,
      contentWidth - 10
    );

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "right" });
    }

    doc.save(`medical-report-${report.id}.pdf`);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-6 rounded-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medical Report</h2>
        <button onClick={downloadPDF} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
      <div className="space-y-4">
        {report.report.map((finding, index) => {
          const hasData = finding.type === "axillia" ? finding.found === 1 : Object.keys(finding).some((key) => key !== "type" && key !== "found" && finding[key as keyof typeof finding] !== undefined);

          return finding.found === 1 ? (
            <div
              key={index}
              className={`
                ${darkMode ? "border-gray-700" : "border-gray-200"} 
                border rounded-lg overflow-hidden
                ${activeSection === finding.type ? "ring-2 ring-yellow-400" : ""}
                transition-all duration-300
              `}
            >
              <button
                onClick={() => toggleSection(index)}
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
                    {finding.confidence && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">
                        {finding.confidence.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {expandedSections.includes(index) ? <ChevronDown className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} /> : <ChevronRight className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />}
                </div>
              </button>
              {expandedSections.includes(index) && (
                <div className={`px-4 pb-4 pt-2 ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
                  <div className="space-y-2 pl-8">
                    {finding.type === "axillia" ? (
                      <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Findings:</span> Present
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
          ) : null;
        })}
      </div>
    </div>
  );
};
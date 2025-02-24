import React from "react";
import { Download, Microscope, AlertCircle, FileText, Calendar, User, Hospital } from "lucide-react";
import { ImageReport } from "../../../types/reports";

interface ReportProps {
  report: ImageReport;
}

const ReportHeader = () => (
  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-white border-b">
    <div className="flex items-center gap-4">
      <div className="bg-blue-500 p-3 rounded-full">
        <Hospital className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">MediScan Labs</h1>
        <p className="text-sm text-gray-500">Advanced Medical Imaging</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500">Report ID: {Date.now()}</p>
      <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

const FindingCard = ({ finding }: { finding: any }) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mass":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "calcification":
        return <Microscope className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        {getIcon(finding.type)}
        <h4 className="font-semibold text-lg capitalize text-gray-800">{finding.type}</h4>
      </div>
      <div className="space-y-2">
        {Object.entries(finding).map(
          ([key, value]) =>
            key !== "type" &&
            key !== "found" && (
              <div key={key} className="flex items-center gap-2 text-gray-600">
                <span className="font-medium capitalize min-w-[120px]">{key.replace(/_/g, " ")}:</span>
                <span className="text-gray-800">{String(value)}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export const Report = ({ report }: ReportProps) => {
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add logo and header
    doc.setFontSize(20);
    doc.setTextColor(0, 84, 166);
    doc.text("MediScan Labs", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Advanced Medical Imaging", 20, 30);

    // Add report content
    doc.setTextColor(0, 0, 0);
    let y = 50;

    report.report.forEach((finding) => {
      if (finding.found) {
        doc.setFontSize(14);
        doc.text(`${finding.type.toUpperCase()}`, 20, y);
        y += 10;

        doc.setFontSize(12);
        Object.entries(finding).forEach(([key, value]) => {
          if (key !== "type" && key !== "found") {
            doc.text(`${key.replace(/_/g, " ")}: ${value}`, 30, y);
            y += 8;
          }
        });

        y += 10;
      }
    });

    doc.save(`mammogram-report-${report.id}.pdf`);
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <ReportHeader />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Mammogram Analysis Report</h2>
            <p className="text-gray-500 text-sm mt-1">Comprehensive findings and analysis</p>
          </div>
          <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div className="grid gap-4">{report.report.map((finding, index) => finding.found && <FindingCard key={index} finding={finding} />)}</div>
      </div>

      <div className="bg-gray-50 p-4 mt-6 border-t text-center text-sm text-gray-500">
        <p>This report is generated automatically and should be reviewed by a qualified medical professional.</p>
      </div>
    </div>
  );
};

export default Report;

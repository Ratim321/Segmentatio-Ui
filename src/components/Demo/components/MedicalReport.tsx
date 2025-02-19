import React from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ImageReport } from '../../../types/reports';

interface MedicalReportProps {
  report: ImageReport | null;
  activeSection: string | null;
}

export const MedicalReport = ({ report, activeSection }: MedicalReportProps) => {
  if (!report) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Medical Report', 20, 20);
    doc.setFontSize(12);
    
    let y = 40;
    report.report.forEach(finding => {
      doc.text(`${finding.type.toUpperCase()}:`, 20, y);
      y += 10;
      Object.entries(finding).forEach(([key, value]) => {
        if (key !== 'type' && key !== 'found') {
          doc.text(`- ${key}: ${value}`, 30, y);
          y += 10;
        }
      });
      y += 5;
    });
    
    doc.save(`medical-report-${report.id}.pdf`);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medical Report</h2>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleString()}
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Key Findings</h3>
        {report.report.map((finding, index) => (
          <div
            key={index}
            className={`
              space-y-2 py-3 border-b border-gray-700 last:border-0
              ${activeSection === finding.type ? 'text-yellow-400' : 'text-gray-300'}
              transition-colors duration-200
            `}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{finding.type}</h4>
              <span className="text-sm text-yellow-400">92% confidence</span>
            </div>
            {finding.found === 1 && (
              <div className="pl-4 text-sm space-y-1">
                {Object.entries(finding).map(([key, value]) => {
                  if (key !== 'type' && key !== 'found') {
                    return (
                      <p key={key} className="text-gray-400">
                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                        {value}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-medium mb-2">Analysis Summary</h3>
          <p className="text-gray-400 text-sm">
            Findings suggest further investigation may be required.
            Recommend follow-up imaging in 6 months.
          </p>
        </div>

        <button
          onClick={downloadPDF}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
};
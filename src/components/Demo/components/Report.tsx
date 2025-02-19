import React from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ImageReport } from '../../../types/reports';

interface ReportProps {
  report: ImageReport;
}

export const Report = ({ report }: ReportProps) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Mammogram Analysis Report', 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    
    report.report.forEach(finding => {
      if (finding.found) {
        doc.text(`${finding.type.toUpperCase()}:`, 20, y);
        y += 10;
        
        Object.entries(finding).forEach(([key, value]) => {
          if (key !== 'type' && key !== 'found') {
            doc.text(`- ${key}: ${value}`, 30, y);
            y += 10;
          }
        });
        
        y += 5;
      }
    });
    
    doc.save(`mammogram-report-${report.id}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Analysis Report</h3>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
      <div className="space-y-4">
        {report.report.map((finding, index) => (
          finding.found ? (
            <div key={index} className="border-b pb-4">
              <h4 className="font-medium capitalize mb-2">{finding.type}</h4>
              <div className="pl-4 space-y-1">
                {Object.entries(finding).map(([key, value]) => (
                  key !== 'type' && key !== 'found' && (
                    <p key={key} className="text-gray-600">
                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                    </p>
                  )
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};
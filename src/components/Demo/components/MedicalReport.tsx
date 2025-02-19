import React, { useState } from 'react';
import { Download, ChevronDown, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ImageReport } from '../../../types/reports';
import { REGION_COLOR_MAP } from '../../../lib/constants';

interface MedicalReportProps {
  report: ImageReport;
  activeSection: string | null;
}

export const MedicalReport = ({ report, activeSection }: MedicalReportProps) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="space-y-4">
        {report.report.map((finding, index) => (
          finding.found ? (
            <div
              key={index}
              className={`
                border border-gray-700 rounded-lg overflow-hidden
                ${activeSection === finding.type ? 'ring-2 ring-yellow-400' : ''}
              `}
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-800 transition-colors"
              >
                <div 
                  className="w-1.5 h-12 rounded-full" 
                  style={{ 
                    backgroundColor: REGION_COLOR_MAP[finding.type as keyof typeof REGION_COLOR_MAP] || '#666'
                  }} 
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-left capitalize">{finding.type}</h4>
                    <p className="text-sm text-gray-400">Click to view details</p>
                  </div>
                  {expandedSections.includes(index) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedSections.includes(index) && (
                <div className="px-4 pb-4 pt-2 bg-gray-800/50">
                  <div className="space-y-2 pl-8">
                    {Object.entries(finding).map(([key, value]) => {
                      if (key !== 'type' && key !== 'found') {
                        return (
                          <p key={key} className="text-gray-300">
                            <span className="text-gray-400 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>{' '}
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
          ) : null
        ))}
      </div>
    </div>
  );
};
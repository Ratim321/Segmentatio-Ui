import React, { useState } from 'react';
import { ImageReport } from '../../../types/reports';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MedicalReportProps {
  activeSection: string | null;
  report: ImageReport | null;
}

export const MedicalReport: React.FC<MedicalReportProps> = ({ activeSection, report }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  if (!report) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-emerald-500';
    if (confidence >= 90) return 'text-amber-500';
    return 'text-red-500';
  };

  const getHighlightClass = (section: string) => {
    return activeSection === section
      ? 'bg-gray-800/50 border-l-4 border-blue-500'
      : '';
  };

  return (
    <div className="sticky top-24 bg-gray-900 text-gray-100 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Medical Report</h2>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleString()}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium mb-4">Key Findings</h3>
        
        {report.report.map((finding, index) => (
          finding.found ? (
            <div
              key={index}
              className={`
                transition-all duration-300 ease-out
                ${getHighlightClass(finding.type)}
              `}
            >
              <button
                onClick={() => toggleSection(finding.type)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {expandedSections[finding.type] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="capitalize">{finding.type}</span>
                </div>
                <span className={`text-sm ${getConfidenceColor(92)}`}>
                  {92.0}% confidence
                </span>
              </button>

              {expandedSections[finding.type] && (
                <div className="px-4 py-3 space-y-2 text-sm text-gray-300 bg-gray-800/20 rounded-lg mt-1 mb-2">
                  {Object.entries(finding).map(([key, value]) => {
                    if (key !== 'type' && key !== 'found') {
                      return (
                        <p key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-gray-100">{value}</span>
                        </p>
                      );
                    }
                    return null;
                  })}
                  
                  {finding.type === 'calcification' && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium mb-2">References:</h4>
                      <a 
                        href="#"
                        className="text-blue-400 hover:text-blue-300 text-sm block"
                      >
                        {finding.type} Patterns (Radiology Journal)
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null
        ))}

        <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <h4 className="text-sm font-medium text-blue-400 mb-2">
            Analysis Summary
          </h4>
          <p className="text-sm text-gray-300">
            Findings suggest further investigation may be required. Recommend follow-up imaging in 6 months.
          </p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS } from '../utils/helpers';

interface ReportProps {
  findings: Array<{
    name: string;
    confidence: number;
    details?: string;
    references?: Array<{
      title: string;
      source: string;
    }>;
    colorIndex?: number;
  }>;
  reportId: string;
}

export function Report({ findings, reportId }: ReportProps) {
  const [expandedFinding, setExpandedFinding] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Medical Report
        </h4>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleString()}
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
          <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
            Key Findings
          </h5>
          <div className="space-y-2">
            {findings.map((finding, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between py-2 cursor-pointer"
                  onClick={() => setExpandedFinding(expandedFinding === index ? null : index)}
                >
                  <div className="flex items-center flex-1">
                    <div
                      className={`w-1 h-8 rounded-full mr-3 ${
                        finding.colorIndex !== undefined
                          ? COLORS[finding.colorIndex].bg
                          : finding.confidence > 90
                          ? 'bg-red-500'
                          : 'bg-cyan-500'
                      }`}
                    />
                    <span className={`${
                      finding.colorIndex !== undefined
                        ? `text-${COLORS[finding.colorIndex].name}-600 dark:text-${COLORS[finding.colorIndex].name}-400`
                        : 'text-gray-700 dark:text-gray-300'
                    } font-medium`}>
                      {finding.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      {finding.confidence.toFixed(1)}% confidence
                    </span>
                    {(finding.details || finding.references) && (
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        {expandedFinding === index ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {expandedFinding === index && (finding.details || finding.references) && (
                  <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    {finding.details && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {finding.details}
                      </p>
                    )}
                    {finding.references && finding.references.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">References:</p>
                        {finding.references.map((ref, idx) => (
                          <p key={idx} className="text-xs text-gray-500">
                            {ref.title} ({ref.source})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>Report ID: {reportId}</p>
          <p className="mt-1">
            This report is generated automatically by AI analysis. Please consult with a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
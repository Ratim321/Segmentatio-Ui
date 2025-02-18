import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface SegmentData {
  type: 'mass' | 'calcification' | 'axilla' | 'tissue';
  color: string;
  report: {
    massDefinition?: 'Well-defined' | 'Ill-defined' | 'Spiculated';
    massDensity?: 'Low Dense' | 'Iso-dense/ Equal Dense' | 'High Dense';
    massShape?: 'Oval' | 'Round' | 'Irregular';
    axillaFindings?: 'Yes' | 'No';
    calcificationType?: 'Discrete' | 'Cluster/Grouped' | 'Line/Segmental';
    breastDensity?: 'fatty/normal' | 'fibroglandular/mixed fatty and fibroglandular' | 'heterogeneously dense' | 'highly dense';
  };
}

const segmentData: Record<string, SegmentData> = {
  '#7DEE3F': {
    type: 'mass',
    color: '#7DEE3F',
    report: {
      massDefinition: 'Spiculated',
      massDensity: 'High Dense',
      massShape: 'Irregular'
    }
  },
  '#d86b3c': {
    type: 'calcification',
    color: '#d86b3c',
    report: {
      calcificationType: 'Cluster/Grouped'
    }
  },
  '#EA6DAA': {
    type: 'axilla',
    color: '#EA6DAA',
    report: {
      axillaFindings: 'Yes'
    }
  },
  '#3C9BD8': {
    type: 'tissue',
    color: '#3C9BD8',
    report: {
      breastDensity: 'heterogeneously dense'
    }
  }
};

export function ImageViewer() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Mammogram Segmentation Analysis
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="relative group">
            <img
              src="/Asset 2.svg"
              alt="Segmented Mammogram"
              className="w-full h-auto"
              useMap="#segmentMap"
            />
            
            <Tooltip.Provider>
              {Object.entries(segmentData).map(([color, data]) => (
                <Tooltip.Root key={color}>
                  <Tooltip.Trigger asChild>
                    <div
                      className={`absolute inset-0 transition-transform cursor-pointer
                        ${hoveredSegment === color ? 'scale-105' : 'scale-100 opacity-0 hover:opacity-100'}`}
                      style={{
                        backgroundColor: color,
                        mixBlendMode: 'multiply'
                      }}
                      onMouseEnter={() => setHoveredSegment(color)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-md z-50 border border-gray-200
                               animate-in fade-in duration-200"
                      sideOffset={5}
                    >
                      <ReportContent data={data} />
                      <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </Tooltip.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportContent({ data }: { data: SegmentData }) {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-900 capitalize">{data.type} Analysis</h3>
      
      <div className="space-y-2">
        {data.report.massDefinition && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Definition:</span>
            <span className="font-medium">{data.report.massDefinition}</span>
          </div>
        )}
        {data.report.massDensity && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Density:</span>
            <span className="font-medium">{data.report.massDensity}</span>
          </div>
        )}
        {data.report.massShape && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Shape:</span>
            <span className="font-medium">{data.report.massShape}</span>
          </div>
        )}
        {data.report.axillaFindings && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Findings:</span>
            <span className="font-medium">{data.report.axillaFindings}</span>
          </div>
        )}
        {data.report.calcificationType && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{data.report.calcificationType}</span>
          </div>
        )}
        {data.report.breastDensity && (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Density:</span>
            <span className="font-medium">{data.report.breastDensity}</span>
          </div>
        )}
      </div>
    </div>
  );
}
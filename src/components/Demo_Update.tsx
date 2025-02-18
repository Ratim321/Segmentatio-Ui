import React, { useState } from 'react';
import { ImageSegmentation } from './Demo/components/ImageSegmentation';
import { SegmentationDetails } from './Demo/components/SegmentationDetails';
import { ComparisonModal } from './Demo/components/ComparisonModal';

interface Region {
  id: string;
  coords: string;
  findings: {
    mass?: boolean;
    calcification?: boolean;
    tissue?: boolean;
    axilla?: boolean;
  };
  details: {
    title: string;
    description: string;
    report: {
      massPresence: string;
      massDefinition?: string;
      massDensity?: string;
      massShape?: string;
      calcificationPresence: string;
      calcificationType?: string;
      breastDensity: string;
      biradsCategory: string;
      axillaFindings?: string;
    };
  };
}

const mammogramRegions: Region[] = [
  {
    id: '1',
    coords: 'M 600 100 C 650 100, 700 150, 700 200 C 720 250, 650 300, 600 300 C 550 300, 500 250, 500 200 C 500 150, 550 100, 600 100 Z',
    findings: {
      mass: true,
      calcification: true,
      tissue: true
    },
    details: {
      title: 'Upper Outer Quadrant',
      description: 'Dense tissue area with suspicious mass and calcifications.',
      report: {
        massPresence: 'Yes',
        massDefinition: 'Spiculated',
        massDensity: 'High Dense',
        massShape: 'Irregular',
        calcificationPresence: 'Yes',
        calcificationType: 'Cluster/Grouped',
        breastDensity: 'heterogeneously dense',
        biradsCategory: '4'
      }
    }
  },
  {
    id: '2',
    coords: 'M 550 350 C 600 350, 650 400, 650 450 C 650 500, 600 550, 550 550 C 500 550, 450 500, 450 450 C 450 400, 500 350, 550 350 Z',
    findings: {
      tissue: true,
      axilla: true
    },
    details: {
      title: 'Lower Inner Quadrant',
      description: 'Normal breast tissue with typical parenchymal pattern.',
      report: {
        massPresence: 'No',
        breastDensity: 'fibroglandular/mixed fatty and fibroglandular',
        axillaFindings: 'No',
        calcificationPresence: 'No',
        biradsCategory: '1'
      }
    }
  }
];

// Add case studies data
const caseStudies = [
  {
    id: 1,
    image: "path/to/case1.jpg",
    diagnosis: "Benign mass with calcifications",
    similarity: 85,
    metrics: {
      volume: 18.5,
      density: 0.9,
      growth: 0.5,
      infiltration: 2.1
    },
    segmentation: []
  },
  // Add more case studies as needed
];

export default function Demo_Update() {
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [currentCaseStudyIndex, setCurrentCaseStudyIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>("path/to/current/image.jpg");

  const handleCompare = () => {
    setShowComparisonModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mammogram Analysis</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              + New Region
            </button>
            <button 
              onClick={handleCompare}
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              ⚡ Compare Cases
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="relative">
                <ImageSegmentation
                  imageSrc="https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  regions={mammogramRegions}
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Hover over highlighted regions for detailed findings
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <SegmentationDetails 
              regions={mammogramRegions} 
              onCompare={handleCompare}
            />
          </div>
        </div>

        {showComparisonModal && (
          <ComparisonModal
            onClose={() => setShowComparisonModal(false)}
            selectedImage={selectedImage}
            currentCaseStudyIndex={currentCaseStudyIndex}
            caseStudies={caseStudies}
            onPrevious={() => setCurrentCaseStudyIndex(prev => Math.max(0, prev - 1))}
            onNext={() => setCurrentCaseStudyIndex(prev => Math.min(caseStudies.length - 1, prev + 1))}
          />
        )}
      </div>
    </div>
  );
}
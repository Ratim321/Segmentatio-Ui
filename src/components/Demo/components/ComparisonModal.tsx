import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { imageReports } from '../../../data/reports';
import { MedicalReport } from './MedicalReport';

interface ComparisonModalProps {
  currentReport: typeof imageReports[0];
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonModal = ({ currentReport, isOpen, onClose }: ComparisonModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const otherReports = imageReports.filter(report => report.id !== currentReport.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % otherReports.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + otherReports.length) % otherReports.length);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-6xl rounded-xl shadow-2xl my-auto"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 rounded-t-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Case Comparison Analysis
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 70px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Case */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                Current Case
              </h4>
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={currentReport.output_img}
                  alt="Current case"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-y-auto">
                <MedicalReport report={currentReport} activeSection={null} />
              </div>
            </div>

            {/* Comparison Case */}
            <div className="space-y-4">
              <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Comparison Case {currentIndex + 1} of {otherReports.length}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevious}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    aria-label="Previous case"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    aria-label="Next case"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={otherReports[currentIndex].output_img}
                  alt={`Comparison case ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-y-auto">
                <MedicalReport report={otherReports[currentIndex]} activeSection={null} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
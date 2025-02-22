import React from 'react';
import ImageSegmentation from '../components/Demo/components/ImageSegmentation';

const Demo = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Advanced Medical Image Analysis
              <span className="block text-blue-600 dark:text-blue-400">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience state-of-the-art medical image segmentation with our advanced AI system.
              Upload your images and get detailed analysis in seconds.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-200">99.9% Accuracy</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-200">Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-200">Detailed Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <ImageSegmentation />
        </div>
      </div>
    </div>
  );
};

export default Demo;
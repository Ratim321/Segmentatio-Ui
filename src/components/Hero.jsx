import React from 'react';
import { Brain, Activity, ScanFace } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative 
        overflow-hidden 
        bg-gradient-to-b 
        from-blue-50 
        to-white 
        dark:from-gray-900 
        dark:to-gray-900 
        transition-colors
      "
    >
      <div className="max-w-7xl h-screen flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8 animate-fade-in">
            Advanced Medical Image
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Segmentation AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Revolutionizing medical imaging with state-of-the-art AI technology.
            Precise, fast, and reliable segmentation for better diagnosis.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/demo')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Demo
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Brain className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Neural Networks
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced deep learning models trained on extensive medical datasets.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Activity className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Real-time Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lightning-fast segmentation results in milliseconds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <ScanFace className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              High Accuracy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              99.9% accuracy in identifying and segmenting medical images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

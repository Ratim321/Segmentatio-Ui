import React from 'react';
import { 
  Brain, 
  Activity, 
  ScanFace, 
  Microscope, 
  HeartPulse, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-4 top-1/4 w-32 h-32 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-0 top-1/3 w-32 h-32 bg-indigo-600/30 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      <div className="max-w-7xl h-screen flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header Section */}
        <div className="text-center relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-4">
                <Microscope className="w-8 h-8 text-white animate-float" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Advanced Medical Image
            <div className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}Segmentation AI
              </span>
              <Sparkles className="absolute -right-8 -top-1 w-6 h-6 text-blue-500 animate-bounce" />
            </div>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Revolutionizing medical imaging with state-of-the-art AI technology.
            Precise, fast, and reliable segmentation for better diagnosis.
          </p>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/demo')}
              className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
            >
              Try Demo
              <HeartPulse className="w-4 h-4 group-hover:animate-pulse" />
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2">
              Learn More
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:animate-pulse"></div>
              <Brain className="w-12 h-12 text-blue-600 relative" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Neural Networks
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Advanced deep learning models trained on extensive medical datasets.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:animate-pulse"></div>
              <Activity className="w-12 h-12 text-blue-600 relative" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Real-time Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lightning-fast segmentation results in milliseconds.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:animate-pulse"></div>
              <ScanFace className="w-12 h-12 text-blue-600 relative" />
            </div>
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

import React from 'react';
import { X, Brain, Activity, LineChart, ArrowLeft, ArrowRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { CaseStudy } from '../types';

interface ComparisonModalProps {
  onClose: () => void;
  selectedImage: string | null;
  currentCaseStudyIndex: number;
  caseStudies: CaseStudy[];
  onPrevious: () => void;
  onNext: () => void;
}

export function ComparisonModal({
  onClose,
  selectedImage,
  currentCaseStudyIndex,
  caseStudies,
  onPrevious,
  onNext,
}: ComparisonModalProps) {
  const metrics = {
    labels: ["Volume", "Density", "Growth Rate", "Infiltration"],
    datasets: [
      {
        label: "Current Case",
        data: [22.1, 1.1, 0.7, 2.9],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        fill: true,
      },
      {
        label: "Similar Case",
        data: [
          caseStudies[currentCaseStudyIndex].metrics.volume,
          caseStudies[currentCaseStudyIndex].metrics.density,
          caseStudies[currentCaseStudyIndex].metrics.growth,
          caseStudies[currentCaseStudyIndex].metrics.infiltration,
        ],
        borderColor: "rgb(234, 88, 12)",
        backgroundColor: "rgba(234, 88, 12, 0.5)",
        fill: true,
      },
    ],
  };

  const timeSeriesData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Growth Progression",
        data: [1.2, 1.8, 2.3, 2.9, 3.2, 3.8],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Case Comparison Analysis
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Images Comparison */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Image Analysis
                </h4>
                <div className="space-y-4">
                  <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <img
                      src={selectedImage || ""}
                      alt="Current case"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm text-gray-900 dark:text-gray-100">
                      Current Case
                    </div>
                  </div>
                  <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <img
                      src={caseStudies[currentCaseStudyIndex].image}
                      alt="Similar case"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm text-gray-900 dark:text-gray-100">
                      Similar Case
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics and Analysis */}
            <div className="space-y-6">
              <MetricsSection
                diagnosis={caseStudies[currentCaseStudyIndex].diagnosis}
                similarity={caseStudies[currentCaseStudyIndex].similarity}
                metrics={metrics}
                timeSeriesData={timeSeriesData}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={onPrevious}
              disabled={currentCaseStudyIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                currentCaseStudyIndex === 0
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              } transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Case
            </button>
            <button
              onClick={onNext}
              disabled={currentCaseStudyIndex === caseStudies.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                currentCaseStudyIndex === caseStudies.length - 1
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              } transition-colors`}
            >
              Next Case
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricsSectionProps {
  diagnosis: string;
  similarity: number;
  metrics: any;
  timeSeriesData: any;
}

function MetricsSection({ diagnosis, similarity, metrics, timeSeriesData }: MetricsSectionProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Disease Metrics Comparison",
        color: "#1f2937",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
        <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Brain className="w-5 h-5 text-blue-600" />
          Diagnosis & Similarity
        </h4>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {diagnosis}
          </p>
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Similarity Score
            </div>
            <div className="mt-2 relative">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${similarity}%` }}
                />
              </div>
              <span className="absolute -right-1 -top-6 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                {similarity}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
        <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Activity className="w-5 h-5 text-blue-600" />
          Metrics Comparison
        </h4>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="h-64">
            <Line options={options} data={metrics} />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
        <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <LineChart className="w-5 h-5 text-blue-600" />
          Growth Progression
        </h4>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="h-48">
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              data={timeSeriesData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
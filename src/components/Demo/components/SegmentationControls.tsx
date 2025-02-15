import React from 'react';
import { Plus, Activity } from 'lucide-react';

interface SegmentationControlsProps {
  showSegmentation: boolean;
  isDrawing: boolean;
  selectedImage: string | null;
  onNewRegion: () => void;
  onCompare: () => void;
}

export function SegmentationControls({
  showSegmentation,
  isDrawing,
  selectedImage,
  onNewRegion,
  onCompare,
}: SegmentationControlsProps) {
  return (
    <div className="flex gap-2">
      {selectedImage && showSegmentation && !isDrawing && (
        <button
          onClick={onNewRegion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Region
        </button>
      )}
      {selectedImage && showSegmentation && (
        <button
          onClick={onCompare}
          className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
        >
          <Activity className="w-4 h-4" />
          Compare Cases
        </button>
      )}
    </div>
  );
}
import React from 'react';
import { Upload, ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploader({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: ImageUploaderProps) {
  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-800 rounded-2xl p-6 
        transition-all duration-300 
        ${isDragging ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:shadow-md"}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-blue-400 pointer-events-none" />
      <label className="relative z-10 block cursor-pointer">
        <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
        <div className="text-center py-8">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 transition-colors group-hover:text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-50 transition-colors">
            <span className="font-medium">Drop your medical image here</span> or{' '}
            <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              browse files
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Supports DICOM, JPEG, PNG formats
          </p>
        </div>
      </label>
    </div>
  );
}
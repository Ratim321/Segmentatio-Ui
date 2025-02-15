import React from 'react';
import { Plus, ImageIcon } from 'lucide-react';
import { SampleImage } from '../types';

interface SampleImagesProps {
  images: SampleImage[];
  onImageSelect: (image: SampleImage) => void;
}

export function SampleImages({ images, onImageSelect }: SampleImagesProps) {
  return (
    <div className="flex">
      {images.map((image) => (
        <button
          key={image.id}
          onClick={() => onImageSelect(image)}
          className="group me-2 relative w-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-md"
        >
          {image.thumbnail ? (
            <>
              <img src={image.thumbnail} alt={image.type} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">{image.type}</p>
                  <p className="text-xs opacity-80">{image.description}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
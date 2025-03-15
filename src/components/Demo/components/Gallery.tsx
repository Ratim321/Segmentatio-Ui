import React from 'react';
import { Upload } from 'lucide-react';

interface GalleryProps {
  images: string[];
  selectedImage: string | null;
  onImageSelect: (image: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Gallery = ({ images, selectedImage, onImageSelect, onFileUpload }: GalleryProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative w-32 h-32 cursor-pointer rounded-lg overflow-hidden border-2 
            ${selectedImage === image ? 'border-blue-500' : 'border-gray-200'}`}
          onClick={() => onImageSelect(image)}
        >
          <img src={image} alt={`Mammogram ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
        <input type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="text-sm text-gray-500 mt-2">Upload Image</span>
      </label>
    </div>
  );
};
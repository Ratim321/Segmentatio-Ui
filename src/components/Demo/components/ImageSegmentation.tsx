import React, { useRef, useState } from 'react';
import { Region } from '../types';
import { MultipleTooltips } from './MultipleTooltips';
import { MinusCircle, PlusCircle, Maximize2 } from "lucide-react";

interface ImageSegmentationProps {
  imageSrc: string;
  regions: Region[];
}

export function ImageSegmentation({ imageSrc, regions }: ImageSegmentationProps) {
  const [activeRegion, setActiveRegion] = React.useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  return (
    <div className="relative w-full h-[80vh] aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden group">
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
      >
        <img 
          src={imageSrc} 
          alt="Medical scan" 
          className="w-full h-full object-cover transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        />
        <svg 
          className="absolute top-0 left-0 w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, mixBlendMode: 'multiply' }}
        >
          <g className="pointer-events-auto">
            {regions.map((region) => (
              <path
                key={region.id}
                d={region.coords}
                className={`
                  fill-blue-500/20 hover:fill-blue-500/40 cursor-pointer transition-all duration-500
                  ${activeRegion === region.id ? 'stroke-blue-400 stroke-[3px] fill-blue-500/30' : 'stroke-white stroke-[2px]'}
                `}
                strokeDasharray="4 2"
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
              />
            ))}
          </g>
        </svg>
        {activeRegion && (
          <MultipleTooltips 
            region={regions.find(r => r.id === activeRegion)!}
            mousePosition={mousePosition}
            onClose={() => setActiveRegion(null)}
          />
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleZoomOut} 
          className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
          title="Zoom Out"
        >
          <MinusCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button 
          onClick={handleZoomIn} 
          className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
          title="Zoom In"
        >
          <PlusCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button 
          onClick={handleZoomReset} 
          className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
          title="Reset Zoom"
        >
          <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
}
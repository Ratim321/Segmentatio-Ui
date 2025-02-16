import React from 'react';
import { MinusCircle, PlusCircle, Maximize2, ImageIcon } from 'lucide-react';
import { Point, Polygon } from '../types';
import { COLORS } from '../utils/helpers';

interface SegmentationCanvasProps {
  selectedImage: string | null;
  showSegmentation: boolean;
  polygons: Polygon[];
  isDrawing: boolean;
  tempPoints: Point[];
  hoveredPolygon: string | null;
  zoomLevel: number;
  svgRef: React.RefObject<SVGSVGElement>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
  onPointMouseDown: (polygonId: string, index: number) => (e: React.MouseEvent) => void;
  onHoverPolygon: (id: string | null) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function SegmentationCanvas({
  selectedImage,
  showSegmentation,
  polygons,
  isDrawing,
  tempPoints,
  hoveredPolygon,
  zoomLevel,
  svgRef,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
  onPointMouseDown,
  onHoverPolygon,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: SegmentationCanvasProps) {
  return (
    <div className="relative w-full h-[80vh] aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden group">
      {selectedImage ? (
        <>
          <img
            src={selectedImage}
            alt="Selected medical image"
            className="w-full h-full object-cover transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          />
          {showSegmentation && (
            <>
              <div className="absolute inset-0">
                <svg
                  ref={svgRef}
                  className="w-full h-full cursor-crosshair transition-transform duration-200"
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                  onClick={onClick}
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {polygons.map((polygon) => (
                    <g
                      key={polygon.id}
                      className={`
                        animate-draw 
                        transition-transform 
                        duration-200 
                        ${hoveredPolygon === polygon.id ? "scale-105" : "scale-100"}
                      `}
                      onMouseEnter={() => onHoverPolygon(polygon.id)}
                      onMouseLeave={() => onHoverPolygon(null)}
                    >
                      <polygon
                        points={polygon.points.map((p) => `${p.x},${p.y}`).join(" ")}
                        className={`
                          ${COLORS[parseInt(polygon.color)].fill} 
                          ${COLORS[parseInt(polygon.color)].stroke} 
                          stroke-2 
                          transition-opacity
                          ${hoveredPolygon === polygon.id ? "opacity-80" : "opacity-50"}
                        `}
                      />
                      {polygon.points.map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r="6"
                          className={`
                            fill-white 
                            ${COLORS[parseInt(polygon.color)].stroke} 
                            stroke-2 
                            cursor-move 
                            hover:fill-blue-100
                          `}
                          onMouseDown={onPointMouseDown(polygon.id, index)}
                        />
                      ))}
                      {hoveredPolygon === polygon.id && polygon.details && (
                        <foreignObject 
                          x={polygon.points[0].x} 
                          y={polygon.points[0].y - 40} 
                          width="200" 
                          height="1000"
                          className="overflow-visible "
                        >
                          <div 
                            className="
                              bg-white/90 dark:bg-gray-800/90 
                              dark:text-gray-100/90 
                              backdrop-blur-sm 
                              p-3 
                              rounded-lg 
                              shadow-lg 
                              text-sm
                              max-w-[200px]
                              whitespace-pre-wrap
                              break-words
                            "
                          >
                            {polygon.details}
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  ))}

                  {isDrawing && tempPoints.length > 0 && (
                    <g className="animate-draw">
                      <polyline
                        points={tempPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                        className="fill-none stroke-blue-600 stroke-2 stroke-dashed"
                      />
                      {tempPoints.map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          className="fill-white stroke-blue-600 stroke-2"
                        />
                      ))}
                    </g>
                  )}
                </svg>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={onZoomOut}
                  className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                  title="Zoom Out"
                >
                  <MinusCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <button
                  onClick={onZoomIn}
                  className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                  title="Zoom In"
                >
                  <PlusCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <button
                  onClick={onZoomReset}
                  className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
          <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No image selected</p>
        </div>
      )}
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Plus, Trash2, Edit2, ArrowLeft, ArrowRight } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Polygon {
  id: string;
  points: Point[];
  color: string;
  name: string;
  details?: string;
}

interface CaseStudy {
  id: number;
  image: string;
  diagnosis: string;
  segmentation: Polygon[];
  similarity: number;
}

const COLORS = [
  { fill: 'fill-blue-500/20', stroke: 'stroke-blue-600', bg: 'bg-blue-500', name: 'Region' },
  { fill: 'fill-red-500/20', stroke: 'stroke-red-600', bg: 'bg-red-500', name: 'Critical' },
  { fill: 'fill-green-500/20', stroke: 'stroke-green-600', bg: 'bg-green-500', name: 'Safe' },
  { fill: 'fill-purple-500/20', stroke: 'stroke-purple-600', bg: 'bg-purple-500', name: 'Target' },
  { fill: 'fill-orange-500/20', stroke: 'stroke-orange-600', bg: 'bg-orange-500', name: 'Review' },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    diagnosis: "Brain Tumor - Glioblastoma",
    similarity: 89,
    segmentation: [
      {
        id: 'case1-1',
        points: [
          { x: 150, y: 50 }, { x: 250, y: 50 }, { x: 300, y: 150 },
          { x: 250, y: 250 }, { x: 150, y: 250 }, { x: 100, y: 150 },
        ],
        color: '0',
        name: 'Tumor Mass',
        details: 'Primary tumor region with high contrast enhancement'
      }
    ]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=300&h=300",
    diagnosis: "Lung Nodule",
    similarity: 75,
    segmentation: [
      {
        id: 'case2-1',
        points: [
          { x: 200, y: 100 }, { x: 300, y: 100 }, { x: 350, y: 200 },
          { x: 300, y: 300 }, { x: 200, y: 300 }, { x: 150, y: 200 },
        ],
        color: '1',
        name: 'Nodule Area',
        details: 'Suspicious nodule with irregular borders'
      }
    ]
  }
];

export default function Demo() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [polygons, setPolygons] = useState<Polygon[]>([
    {
      id: '1',
      points: [
        { x: 150, y: 50 }, { x: 250, y: 50 }, { x: 300, y: 150 },
        { x: 250, y: 250 }, { x: 150, y: 250 }, { x: 100, y: 150 },
      ],
      color: '0',
      name: 'Tumor Region',
      details: 'Suspected abnormal tissue mass with irregular borders'
    }
  ]);
  const [activePolygon, setActivePolygon] = useState<string | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<Point[]>([]);
  const [editingPolygon, setEditingPolygon] = useState<string | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [currentCaseStudyIndex, setCurrentCaseStudyIndex] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const sampleImages = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
      result: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
      type: "Brain MRI"
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=300&h=300",
      result: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=300&h=300",
      type: "Chest X-Ray"
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=300&h=300",
      result: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=300&h=300",
      type: "CT Scan"
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleImageSelect = (image: typeof sampleImages[0]) => {
    setSelectedImage(image.thumbnail);
    setShowSegmentation(false);
    setTimeout(() => setShowSegmentation(true), 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowSegmentation(false);
        setTimeout(() => setShowSegmentation(true), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSVGPoint = (e: React.MouseEvent): Point | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handlePointMouseDown = (polygonId: string, index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePolygon(polygonId);
    setActivePointIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getSVGPoint(e);
    if (!point) return;

    if (activePointIndex !== null && activePolygon !== null) {
      setPolygons(prev => prev.map(poly => 
        poly.id === activePolygon
          ? {
              ...poly,
              points: poly.points.map((p, i) => 
                i === activePointIndex ? point : p
              )
            }
          : poly
      ));
    } else if (isDrawing) {
      const lastPoint = tempPoints[tempPoints.length - 1];
      if (lastPoint && Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 20) {
        setTempPoints(prev => [...prev, point]);
      }
    }
  };

  const handleMouseUp = () => {
    setActivePointIndex(null);
    setActivePolygon(null);
  };

  const startNewPolygon = () => {
    setIsDrawing(true);
    setTempPoints([]);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const point = getSVGPoint(e);
    if (!point) return;

    if (tempPoints.length === 0) {
      setTempPoints([point]);
    } else {
      const firstPoint = tempPoints[0];
      // Check if click is near the first point to close the polygon
      if (tempPoints.length > 2 && 
          Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y) < 20) {
        const colorIndex = polygons.length % COLORS.length;
        setPolygons(prev => [...prev, {
          id: Date.now().toString(),
          points: tempPoints,
          color: colorIndex.toString(),
          name: `${COLORS[colorIndex].name} ${prev.length + 1}`,
          details: 'New region - Add description'
        }]);
        setIsDrawing(false);
        setTempPoints([]);
      } else {
        setTempPoints(prev => [...prev, point]);
      }
    }
  };

  const deletePolygon = (id: string) => {
    setPolygons(prev => prev.filter(poly => poly.id !== id));
    setEditingPolygon(null);
  };

  const updatePolygon = (id: string, updates: Partial<Polygon>) => {
    setPolygons(prev => prev.map(poly =>
      poly.id === id ? { ...poly, ...updates } : poly
    ));
    setEditingPolygon(null);
  };

  const nextCaseStudy = () => {
    setCurrentCaseStudyIndex(prev => 
      prev < CASE_STUDIES.length - 1 ? prev + 1 : prev
    );
  };

  const previousCaseStudy = () => {
    setCurrentCaseStudyIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  return (
    <section className="py-24 bg-gray-50" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4">Interactive Demo</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Upload your medical image or try our sample images to see AI-powered segmentation in action.
          Create multiple regions and adjust them precisely.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div
              className={`group border-4 border-dashed rounded-xl h-80 flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'border-blue-500 bg-blue-50 scale-102' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label className="w-full h-full flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <div className="text-center p-6 transform transition-transform group-hover:scale-105">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 transition-colors group-hover:text-blue-500" />
                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    Drag and drop your medical image here or{' '}
                    <span className="text-blue-600 hover:text-blue-700">browse files</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports DICOM, JPEG, PNG formats
                  </p>
                </div>
              </label>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-6 text-lg">Sample Images</h3>
              <div className="grid grid-cols-3 gap-6">
                {sampleImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageSelect(image)}
                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-md"
                  >
                    {image.thumbnail ? (
                      <>
                        <img
                          src={image.thumbnail}
                          alt={image.type}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Segmentation Result</h3>
                <div className="flex gap-2">
                  {selectedImage && showSegmentation && !isDrawing && (
                    <button
                      onClick={startNewPolygon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      New Region
                    </button>
                  )}
                  {selectedImage && showSegmentation && (
                    <button
                      onClick={() => setShowComparison(prev => !prev)}
                      className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      {showComparison ? 'Hide' : 'Show'} Similar Cases
                    </button>
                  )}
                </div>
              </div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedImage}
                      alt="Selected medical image"
                      className="w-full h-full object-cover"
                    />
                    {showSegmentation && (
                      <div className="absolute inset-0">
                        <svg
                          ref={svgRef}
                          className="w-full h-full cursor-crosshair"
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onClick={handleCanvasClick}
                        >
                          {polygons.map((polygon) => (
                            <g 
                              key={polygon.id} 
                              className="animate-draw"
                              onMouseEnter={() => setHoveredPolygon(polygon.id)}
                              onMouseLeave={() => setHoveredPolygon(null)}
                            >
                              <polygon
                                points={polygon.points.map(p => `${p.x},${p.y}`).join(' ')}
                                className={`${COLORS[parseInt(polygon.color)].fill} ${COLORS[parseInt(polygon.color)].stroke} stroke-2 transition-opacity ${
                                  hoveredPolygon === polygon.id ? 'opacity-80' : 'opacity-50'
                                }`}
                              />
                              {polygon.points.map((point, index) => (
                                <circle
                                  key={index}
                                  cx={point.x}
                                  cy={point.y}
                                  r="6"
                                  className={`fill-white ${COLORS[parseInt(polygon.color)].stroke} stroke-2 cursor-move hover:fill-blue-100`}
                                  onMouseDown={handlePointMouseDown(polygon.id, index)}
                                />
                              ))}
                              {hoveredPolygon === polygon.id && polygon.details && (
                                <foreignObject
                                  x={polygon.points[0].x}
                                  y={polygon.points[0].y - 40}
                                  width="200"
                                  height="35"
                                >
                                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg text-sm">
                                    {polygon.details}
                                  </div>
                                </foreignObject>
                              )}
                            </g>
                          ))}
                          {isDrawing && tempPoints.length > 0 && (
                            <g className="animate-draw">
                              <polyline
                                points={tempPoints.map(p => `${p.x},${p.y}`).join(' ')}
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
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Upload an image to see the results</p>
                  </div>
                )}
              </div>
              {selectedImage && showSegmentation && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Detected Regions:</h4>
                  <div className="space-y-2">
                    {polygons.map((polygon) => (
                      <div key={polygon.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        {editingPolygon === polygon.id ? (
                          <div className="flex-1 flex items-center gap-4">
                            <select
                              value={polygon.color}
                              onChange={(e) => updatePolygon(polygon.id, { color: e.target.value })}
                              className="p-1 rounded border"
                            >
                              {COLORS.map((color, index) => (
                                <option key={index} value={index}>{color.name}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={polygon.name}
                              onChange={(e) => updatePolygon(polygon.id, { name: e.target.value })}
                              className="flex-1 p-1 rounded border"
                            />
                            <input
                              type="text"
                              value={polygon.details || ''}
                              onChange={(e) => updatePolygon(polygon.id, { details: e.target.value })}
                              placeholder="Add details..."
                              className="flex-1 p-1 rounded border"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${COLORS[parseInt(polygon.color)].bg}`}></span>
                            <span className="text-sm text-gray-600">{polygon.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingPolygon(editingPolygon === polygon.id ? null : polygon.id)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePolygon(polygon.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {isDrawing && (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-sm text-gray-600">Drawing new region... (Click near start point to finish)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {showComparison && selectedImage && showSegmentation && (
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">Similar Cases</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={previousCaseStudy}
                      disabled={currentCaseStudyIndex === 0}
                      className={`p-2 rounded-lg ${
                        currentCaseStudyIndex === 0 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextCaseStudy}
                      disabled={currentCaseStudyIndex === CASE_STUDIES.length - 1}
                      className={`p-2 rounded-lg ${
                        currentCaseStudyIndex === CASE_STUDIES.length - 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <img
                      src={CASE_STUDIES[currentCaseStudyIndex].image}
                      alt="Similar case"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Diagnosis</h4>
                      <p className="text-gray-600">{CASE_STUDIES[currentCaseStudyIndex].diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Similarity Score</h4>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${CASE_STUDIES[currentCaseStudyIndex].similarity}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {CASE_STUDIES[currentCaseStudyIndex].similarity}% match
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
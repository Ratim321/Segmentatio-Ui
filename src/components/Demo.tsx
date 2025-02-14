import React, { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, Plus, Trash2, Edit2, ArrowLeft, ArrowRight, X, LineChart, Activity, Brain, Maximize2, MinusCircle, PlusCircle } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Point {
  x: number;
  y: number;
}

interface Polygon {
  id: string;
  points: Point[];
  color: string; // index in COLORS array
  name: string;
  details?: string;
}

interface CaseStudy {
  id: number;
  image: string;
  diagnosis: string;
  similarity: number;
  metrics: {
    volume: number;
    density: number;
    growth: number;
    infiltration: number;
  };
  segmentation: Polygon[];
}

const COLORS = [
  { fill: "fill-blue-500/20", stroke: "stroke-blue-600", bg: "bg-blue-500", name: "Region" },
  { fill: "fill-red-500/20", stroke: "stroke-red-600", bg: "bg-red-500", name: "Critical" },
  { fill: "fill-green-500/20", stroke: "stroke-green-600", bg: "bg-green-500", name: "Safe" },
  { fill: "fill-purple-500/20", stroke: "stroke-purple-600", bg: "bg-purple-500", name: "Target" },
  { fill: "fill-orange-500/20", stroke: "stroke-orange-600", bg: "bg-orange-500", name: "Review" },
];

const SAMPLE_IMAGES = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    result: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    type: "Brain MRI",
    description: "T1-weighted brain MRI scan",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=300&h=300",
    result: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=300&h=300",
    type: "Chest X-Ray",
    description: "High-resolution chest radiograph",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=300&h=300",
    result: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=300&h=300",
    type: "CT Scan",
    description: "Contrast-enhanced CT scan",
  },
];

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    diagnosis: "Brain Tumor - Glioblastoma",
    similarity: 89,
    metrics: {
      volume: 24.5,
      density: 1.2,
      growth: 0.8,
      infiltration: 3.2,
    },
    segmentation: [
      {
        id: "case1-1",
        points: [
          { x: 150, y: 50 },
          { x: 250, y: 50 },
          { x: 300, y: 150 },
          { x: 250, y: 250 },
          { x: 150, y: 250 },
          { x: 100, y: 150 },
        ],
        color: "0",
        name: "Tumor Mass",
        details: "Primary tumor region with high contrast enhancement",
      },
    ],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=300&h=300",
    diagnosis: "Lung Nodule",
    similarity: 75,
    metrics: {
      volume: 12.3,
      density: 0.9,
      growth: 0.3,
      infiltration: 1.8,
    },
    segmentation: [
      {
        id: "case2-1",
        points: [
          { x: 200, y: 100 },
          { x: 300, y: 100 },
          { x: 350, y: 200 },
          { x: 300, y: 300 },
          { x: 200, y: 300 },
          { x: 150, y: 200 },
        ],
        color: "1",
        name: "Nodule Area",
        details: "Suspicious nodule with irregular borders",
      },
    ],
  },
];

// A small helper to generate a random coordinate within the image region
function randomPoint(maxWidth: number, maxHeight: number): Point {
  return {
    x: Math.floor(Math.random() * maxWidth),
    y: Math.floor(Math.random() * maxHeight),
  };
}

// Generate random polygons for an image
function generateRandomPolygons(): Polygon[] {
  // Number of polygons you want, e.g. 1-3 polygons
  const polygonCount = Math.floor(Math.random() * 3) + 1;

  const randomDetails = ["Suspicious region with high infiltration", "Potential lesion - requires further review", "Inflammatory area with mild enhancement", "Benign region - no further action needed", "Irregular shape - recommended follow-up"];

  const newPolygons: Polygon[] = [];

  for (let i = 0; i < polygonCount; i++) {
    // choose a color index from the COLORS array
    const colorIndex = Math.floor(Math.random() * COLORS.length);

    // For a simple random polygon, generate 5-7 points
    const pointCount = Math.floor(Math.random() * 3) + 5;

    const points: Point[] = [];
    for (let j = 0; j < pointCount; j++) {
      // Hard-coded maxWidth & maxHeight for demonstration,
      // can be dynamically measured from the image or container
      points.push(randomPoint(400, 300));
    }

    // pick a random detail
    const detailIndex = Math.floor(Math.random() * randomDetails.length);

    newPolygons.push({
      id: Date.now().toString() + "-" + i,
      points,
      color: colorIndex.toString(),
      name: `${COLORS[colorIndex].name} Mask ${i + 1}`,
      details: randomDetails[detailIndex],
    });
  }

  return newPolygons;
}

export default function Demo() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [activePolygon, setActivePolygon] = useState<string | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<Point[]>([]);
  const [editingPolygon, setEditingPolygon] = useState<string | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [currentCaseStudyIndex, setCurrentCaseStudyIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // For polygon editing form
  const [polygonName, setPolygonName] = useState("");
  const [polygonDetails, setPolygonDetails] = useState("");

  const svgRef = useRef<SVGSVGElement>(null);

  // Add or remove the `dark` class on <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ======================
  // Comparison Modal
  // ======================
  const ComparisonModal = ({ onClose }: { onClose: () => void }) => {
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
          data: [CASE_STUDIES[currentCaseStudyIndex].metrics.volume, CASE_STUDIES[currentCaseStudyIndex].metrics.density, CASE_STUDIES[currentCaseStudyIndex].metrics.growth, CASE_STUDIES[currentCaseStudyIndex].metrics.infiltration],
          borderColor: "rgb(234, 88, 12)",
          backgroundColor: "rgba(234, 88, 12, 0.5)",
          fill: true,
        },
      ],
    };

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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Case Comparison Analysis</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Images Comparison */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Image Analysis</h4>
                  <div className="space-y-4">
                    <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <img src={selectedImage || ""} alt="Current case" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm text-gray-900 dark:text-gray-100">Current Case</div>
                    </div>
                    <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <img src={CASE_STUDIES[currentCaseStudyIndex].image} alt="Similar case" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm text-gray-900 dark:text-gray-100">Similar Case</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics and Analysis */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Diagnosis & Similarity
                  </h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{CASE_STUDIES[currentCaseStudyIndex].diagnosis}</p>
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Similarity Score</div>
                      <div className="mt-2 relative">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${CASE_STUDIES[currentCaseStudyIndex].similarity}%` }}></div>
                        </div>
                        <span className="absolute -right-1 -top-6 bg-blue-600 text-white px-2 py-1 rounded text-xs">{CASE_STUDIES[currentCaseStudyIndex].similarity}%</span>
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
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={previousCaseStudy} disabled={currentCaseStudyIndex === 0} className={`flex items-center gap-2 px-6 py-3 rounded-xl ${currentCaseStudyIndex === 0 ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"} transition-colors`}>
                <ArrowLeft className="w-5 h-5" />
                Previous Case
              </button>
              <button onClick={nextCaseStudy} disabled={currentCaseStudyIndex === CASE_STUDIES.length - 1} className={`flex items-center gap-2 px-6 py-3 rounded-xl ${currentCaseStudyIndex === CASE_STUDIES.length - 1 ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"} transition-colors`}>
                Next Case
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ======================
  // Drag & Drop
  // ======================
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        // Generate a random mask & show
        setPolygons(generateRandomPolygons());
        setShowSegmentation(false);
        setTimeout(() => setShowSegmentation(true), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  // ======================
  // Sample Image Select
  // ======================
  const handleImageSelect = (image: (typeof SAMPLE_IMAGES)[0]) => {
    setSelectedImage(image.thumbnail);
    // Generate a random mask for demonstration
    setPolygons(generateRandomPolygons());
    setShowSegmentation(false);
    // short delay to simulate processing
    setTimeout(() => setShowSegmentation(true), 500);
  };

  // ======================
  // File Select
  // ======================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        // Generate random polygons
        setPolygons(generateRandomPolygons());
        setShowSegmentation(false);
        setTimeout(() => setShowSegmentation(true), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  // ======================
  // SVG & Drawing Logic
  // ======================
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

    // Dragging existing point
    if (activePointIndex !== null && activePolygon !== null) {
      setPolygons((prev) =>
        prev.map((poly) =>
          poly.id === activePolygon
            ? {
                ...poly,
                points: poly.points.map((p, i) => (i === activePointIndex ? point : p)),
              }
            : poly
        )
      );
    }
    // Drawing a new polygon
    else if (isDrawing) {
      const lastPoint = tempPoints[tempPoints.length - 1];
      // Add a new point if the mouse is sufficiently far from the last point
      if (lastPoint && Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 20) {
        setTempPoints((prev) => [...prev, point]);
      }
    }
  };

  const handleMouseUp = () => {
    setActivePointIndex(null);
    setActivePolygon(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const point = getSVGPoint(e);
    if (!point) return;

    if (tempPoints.length === 0) {
      // Start the polygon
      setTempPoints([point]);
    } else {
      // Check if close to first point to complete polygon
      const firstPoint = tempPoints[0];
      if (tempPoints.length > 2 && Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y) < 20) {
        // Complete polygon
        const colorIndex = polygons.length % COLORS.length;
        setPolygons((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            points: tempPoints,
            color: colorIndex.toString(),
            name: `${COLORS[colorIndex].name} ${prev.length + 1}`,
            details: "New region - Add description",
          },
        ]);
        setIsDrawing(false);
        setTempPoints([]);
      } else {
        setTempPoints((prev) => [...prev, point]);
      }
    }
  };

  const startNewPolygon = () => {
    setIsDrawing(true);
    setTempPoints([]);
  };

  // ======================
  // Polygons List & Editing
  // ======================
  const deletePolygon = (id: string) => {
    setPolygons((prev) => prev.filter((poly) => poly.id !== id));
    setEditingPolygon(null);
  };

  const updatePolygon = (id: string, updates: Partial<Polygon>) => {
    setPolygons((prev) => prev.map((poly) => (poly.id === id ? { ...poly, ...updates } : poly)));
  };

  // ======================
  // Case Study Navigation
  // ======================
  const nextCaseStudy = () => {
    setCurrentCaseStudyIndex((prev) => (prev < CASE_STUDIES.length - 1 ? prev + 1 : prev));
  };

  const previousCaseStudy = () => {
    setCurrentCaseStudyIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 
                       text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">Interactive Demo</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-16 max-w-2xl mx-auto">Experience our advanced medical image segmentation tool. Upload your images or try our samples to see AI-powered analysis in action.</p>

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Sample Images</h3>
          {/* Left Panel - Sample Images */}
          <div className="flex space-y-6">
            <div className="flex  p-6 rounded-2xl shadow-sm">
              <div className="flex">
                {SAMPLE_IMAGES.map((image) => (
                  <button key={image.id} onClick={() => handleImageSelect(image)} className="group me-2 relative  w-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-md">
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

              {/* Upload Area */}
              <div
                className={`
                group relative bg-white dark:bg-gray-800 rounded-2xl p-6 
                transition-all duration-300 
                ${isDragging ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:shadow-md"}
              `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-blue-400 pointer-events-none"></div>
                <label className="relative z-10 block cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                  <div className="text-center py-8">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 transition-colors group-hover:text-blue-500" />
                    <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-50 transition-colors">
                      <span className="font-medium">Drop your medical image here</span> or <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">browse files</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Supports DICOM, JPEG, PNG formats</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel - Segmentation Result */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Image Analysis</h3>
                <div className="flex gap-2">
                  {selectedImage && showSegmentation && !isDrawing && (
                    <button onClick={startNewPolygon} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" />
                      New Region
                    </button>
                  )}
                  {selectedImage && showSegmentation && (
                    <button onClick={() => setShowComparison((prev) => !prev)} className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium">
                      <Activity className="w-4 h-4" />
                      Compare Cases
                    </button>
                  )}
                </div>
              </div>

              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                {selectedImage ? (
                  <div className="relative w-full h-full group">
                    <img src={selectedImage} alt="Selected medical image" className="w-full h-full object-cover transition-transform duration-200" style={{ transform: `scale(${zoomLevel})` }} />
                    {showSegmentation && (
                      <>
                        <div className="absolute inset-0">
                          <svg ref={svgRef} className="w-full h-full cursor-crosshair transition-transform duration-200" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={handleCanvasClick} style={{ transform: `scale(${zoomLevel})` }}>
                            {polygons.map((polygon) => (
                              <g
                                key={polygon.id}
                                // Combine your existing animations with a slight scale-up on hover
                                className={`
                                  animate-draw 
                                  transition-transform 
                                  duration-200 
                                  ${hoveredPolygon === polygon.id ? "scale-105" : "scale-100"}
                                `}
                                onMouseEnter={() => setHoveredPolygon(polygon.id)}
                                onMouseLeave={() => setHoveredPolygon(null)}
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
                                    onMouseDown={handlePointMouseDown(polygon.id, index)}
                                  />
                                ))}
                                {hoveredPolygon === polygon.id && polygon.details && (
                                  <foreignObject x={polygon.points[0].x} y={polygon.points[0].y - 40} width="200" height="35">
                                    <div
                                      className="bg-white dark:bg-gray-800 dark:text-gray-100/90
                                                    backdrop-blur-sm p-2 rounded-lg shadow-lg text-sm"
                                    >
                                      {polygon.details}
                                    </div>
                                  </foreignObject>
                                )}
                              </g>
                            ))}

                            {isDrawing && tempPoints.length > 0 && (
                              <g className="animate-draw">
                                <polyline points={tempPoints.map((p) => `${p.x},${p.y}`).join(" ")} className="fill-none stroke-blue-600 stroke-2 stroke-dashed" />
                                {tempPoints.map((point, index) => (
                                  <circle key={index} cx={point.x} cy={point.y} r="4" className="fill-white stroke-blue-600 stroke-2" />
                                ))}
                              </g>
                            )}
                          </svg>
                        </div>
                        {/* Zoom Controls */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.1))} className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors" title="Zoom Out">
                            <MinusCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                          </button>
                          <button onClick={() => setZoomLevel((prev) => Math.min(2, prev + 0.1))} className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors" title="Zoom In">
                            <PlusCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                          </button>
                          <button onClick={() => setZoomLevel(1)} className="p-2 bg-white dark:bg-gray-700/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-colors" title="Reset Zoom">
                            <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  // Fallback UI if no image is selected
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <ImageIcon className="w-10 h-10" />
                    <p className="mt-2">No image selected</p>
                  </div>
                )}
              </div>

              {/* Polygons List & Editing */}
              {showSegmentation && polygons.length > 0 && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Segmentation Details</h4>
                  <div className="space-y-4">
                    {polygons.map((polygon) => {
                      const isEditing = editingPolygon === polygon.id;
                      return (
                        <div key={polygon.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start justify-between shadow-sm border border-gray-200 dark:border-gray-700">
                          {isEditing ? (
                            <form
                              className="flex-grow mr-4"
                              onSubmit={(e) => {
                                e.preventDefault();
                                updatePolygon(polygon.id, {
                                  name: polygonName,
                                  details: polygonDetails,
                                });
                                setEditingPolygon(null);
                              }}
                            >
                              <label className="text-sm font-medium block mb-1 dark:text-gray-100">Name</label>
                              <input value={polygonName} onChange={(ev) => setPolygonName(ev.target.value)} className="border w-full rounded px-2 py-1 text-sm mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                              <label className="text-sm font-medium block mb-1 dark:text-gray-100">Details</label>
                              <textarea value={polygonDetails} onChange={(ev) => setPolygonDetails(ev.target.value)} className="border w-full rounded px-2 py-1 text-sm mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" rows={2} />
                              <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPolygon(null);
                                  }}
                                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex-grow mr-4">
                              <p className="font-medium text-gray-800 dark:text-gray-100">{polygon.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{polygon.details || "No details provided"}</p>
                            </div>
                          )}
                          <div className="flex flex-col items-center space-y-2">
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingPolygon(polygon.id);
                                  setPolygonName(polygon.name);
                                  setPolygonDetails(polygon.details || "");
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                title="Edit Polygon"
                              >
                                <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                              </button>
                            )}
                            <button onClick={() => deletePolygon(polygon.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-red-500" title="Delete Polygon">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Modal */}
        {showComparison && <ComparisonModal onClose={() => setShowComparison(false)} />}
      </div>
    </section>
  );
}

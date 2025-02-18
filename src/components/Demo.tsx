import React, { useState, useRef, useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js"; // Import registerables

import { ImageUploader } from "./Demo/components/ImageUploader";
import { SampleImages } from "./Demo/components/SampleImages";
import { SegmentationCanvas } from "./Demo/components/SegmentationCanvas";
import { SegmentationControls } from "./Demo/components/SegmentationControls";

import { ComparisonModal } from "./Demo/components/ComparisonModal";
import { usePolygon } from "./Demo/hooks/usePolygon";
import { SAMPLE_IMAGES, CASE_STUDIES } from "./Demo/utils/constants";
import { generateRandomPolygons } from "./Demo/utils/helpers";

import { CombinedDetails } from "./Demo/components/CombinedDetails";

interface DemoProps {
  darkMode: boolean;
  onDarkModeChange: (darkMode: boolean) => void;
}

ChartJS.register(...registerables); // Register ChartJS components

export default function Demo({ darkMode, onDarkModeChange }: DemoProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [currentCaseStudyIndex, setCurrentCaseStudyIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const svgRef = useRef<SVGSVGElement>(null);

  const { polygons, setPolygons, activePolygon, setActivePolygon, activePointIndex, setActivePointIndex, isDrawing, setIsDrawing, tempPoints, setTempPoints, editingPolygon, setEditingPolygon, hoveredPolygon, setHoveredPolygon, deletePolygon, updatePolygon, addPolygon } = usePolygon();

  useEffect(() => {
    if (selectedImage || (polygons && polygons.length > 0)) {
      // Check for polygons to handle initial load or resets
      setShowSegmentation(true);
    } else {
      setShowSegmentation(false); // Reset if image is cleared
    }
  }, [selectedImage, polygons]);

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
        setPolygons(generateRandomPolygons());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
        setPolygons(generateRandomPolygons());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSelect = (image: (typeof SAMPLE_IMAGES)[0]) => {
    setSelectedImage(image.thumbnail);
    setPolygons(generateRandomPolygons());
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getSVGPoint(e);
    if (!point) return;

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
    } else if (isDrawing) {
      const lastPoint = tempPoints[tempPoints.length - 1];
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
      setTempPoints([point]);
    } else {
      const firstPoint = tempPoints[0];
      if (tempPoints.length > 2 && Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y) < 20) {
        addPolygon(tempPoints);
        setIsDrawing(false);
        setTempPoints([]);
      } else {
        setTempPoints((prev) => [...prev, point]);
      }
    }
  };

  const handlePointMouseDown = (polygonId: string, index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePolygon(polygonId);
    setActivePointIndex(index);
  };

  const getSVGPoint = (e: React.MouseEvent) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors" id="demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">Interactive Demo</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-16 max-w-2xl mx-auto">Experience our advanced medical image segmentation tool. Upload your images or try our samples to see AI-powered analysis in action.</p>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Sample Images</h3>

            <div className="flex  ">
              {" "}
              {/* Removed space-y-6 */}
              <div className="flex p-6 rounded-2xl shadow-sm space-x-4 ">
                {" "}
                {/*Added space-x-4 for horizontal spacing */}
                <SampleImages images={SAMPLE_IMAGES} onImageSelect={handleImageSelect} />
                <ImageUploader isDragging={isDragging} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onFileSelect={handleFileSelect} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Image Analysis</h3>
                  <SegmentationControls
                    showSegmentation={showSegmentation}
                    isDrawing={isDrawing}
                    selectedImage={selectedImage}
                    onNewRegion={() => {
                      setIsDrawing(true);
                      setTempPoints([]);
                    }}
                    onCompare={() => setShowComparison(true)}
                  />
                </div>

                <div className="flex">
                  <SegmentationCanvas selectedImage={selectedImage} showSegmentation={showSegmentation} polygons={polygons} isDrawing={isDrawing} tempPoints={tempPoints} hoveredPolygon={hoveredPolygon} zoomLevel={zoomLevel} svgRef={svgRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={handleCanvasClick} onPointMouseDown={handlePointMouseDown} onHoverPolygon={setHoveredPolygon} onZoomIn={() => setZoomLevel((prev) => Math.min(2, prev + 0.1))} onZoomOut={() => setZoomLevel((prev) => Math.max(1, prev - 0.1))} onZoomReset={() => setZoomLevel(1)} />

                  {showSegmentation && polygons.length > 0 && (
                    <div className="ml-2">
                      <CombinedDetails polygons={polygons} editingPolygon={editingPolygon} onEdit={setEditingPolygon} onDelete={deletePolygon} onUpdate={updatePolygon} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showComparison && <ComparisonModal onClose={() => setShowComparison(false)} selectedImage={selectedImage} currentCaseStudyIndex={currentCaseStudyIndex} caseStudies={CASE_STUDIES} onPrevious={() => setCurrentCaseStudyIndex((prev) => (prev > 0 ? prev - 1 : prev))} onNext={() => setCurrentCaseStudyIndex((prev) => (prev < CASE_STUDIES.length - 1 ? prev + 1 : prev))} />}
        </div>
      </section>
    </div>
  );
}
